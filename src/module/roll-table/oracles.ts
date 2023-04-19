import type { GameDataRoot, IOracleBase, IOracleCategory } from 'dataforged'
import { hashLookup } from '../dataforged'
import type {
	IOracleBranch,
	IOracleCategoryBranch,
	IOracleLeaf
} from './roll-table-types'
import { OracleTable } from './oracle-table'
import { IronFolder } from '../folder/folder'
import { compact, pick } from 'lodash-es'
import type { helpers } from '../../types/utils'
import { writeFile } from 'fs/promises'

type DataforgedNamespace = 'Starforged' | 'Ironsworn'

/**
 * Extends FVTT's {@link RollTables} to manage the Dataforged oracle tree.
 * @remarks This is a singleton at runtime, but it intentionally implements its Ironsworn-specific static methods so that they're available as (e.g.) `Oracles.findDfId()` instead of `game.tables?.findDfId()`.
 */
export class Oracles extends RollTables {
	fromCompendium(
		...[document, options]: Parameters<RollTables['fromCompendium']>
	) {
		return super.fromCompendium(document, options)
	}

	prepareForImport(data: helpers.SourceDataType<RollTable>) {
		return super.prepareForImport(data)
	}
	// TODO: strip DFIDs when imported from compendium or clone?
	// TODO: reassemble tree when importing from pack

	async importFromCompendium(
		...[pack, id, updateData, options]: Parameters<
			RollTables['importFromCompendium']
		>
	) {
		return await super.importFromCompendium(pack, id, updateData, options)
	}

	/**
	 * Find an oracle tree node by its Dataforged ID.
	 * @param dfid The Dataforged ID to find.
	 * @param includeFolders Should {@link IronFolder} results be included?
	 */
	static findDfId(
		dfid: string,
		includeFolders?: false
	): StoredDocument<OracleTable> | undefined
	static findDfId(
		dfid: string,
		includeFolders: true
	): StoredDocument<Oracles.Node> | undefined
	static findDfId(
		dfid: string,
		includeFolders = false
	): StoredDocument<Oracles.Node> | undefined {
		if (includeFolders) {
			if (game.folders == null)
				throw new Error('game.folders has not been initialized')
			const folder = game.folders.find(
				(folder) =>
					folder.type === 'RollTable' &&
					folder.getFlag('dataforged', '$id') === dfid
			) as StoredDocument<IronFolder & { type: 'RollTable' }>
			if (folder != null) return folder
		}

		if (game.tables == null)
			throw new Error('game.tables has not been initialized')
		return game.tables.find((tbl) => tbl.getFlag('dataforged', '$id') === dfid)
	}

	/**
	 * Returns an array of a Dataforged oracle tree node  with its ancestor folders, or `null` if no matching node is found.
	 * @returns An array ordered by distance from the identified oracle node, beginning with it's "top-level" folder ancestor and ending with the node itself.
	 */
	static findWithAncestors(dfid: string) {
		const target = Oracles.findDfId(dfid, true)
		if (target == null) return null
		const ancestors = [target]
		let current: Oracles.Node | null = target
		while (current != null) {
			if (current.parent != null)
				ancestors.unshift(current.parent as StoredDocument<Oracles.Node>)
			current = current.parent as Oracles.Node | null
		}
		return ancestors
	}

	/** Is the node a root node (e.g. without a parent folder?)  */
	static isRootNode(node: Oracles.Node) {
		return node.folder == null
	}

	/** Should the node be rendered in the oracle tree for this setting? */
	static isShownForSetting(node: Oracles.Node, setting: DataforgedNamespace) {
		const flg = node.getFlag('dataforged', '$id') as string | undefined
		return flg == null || flg.startsWith(setting)
	}

	/** Returns the root nodes for a given setting */
	static getRootNodes(setting: DataforgedNamespace) {
		const rootFolders =
			game.folders?.filter(
				(folder) =>
					folder.type === 'RollTable' &&
					Oracles.isRootNode(folder) &&
					Oracles.isShownForSetting(folder, setting)
			) ?? []
		// our tables don't do this, but user custom tables might
		const rootTables =
			game.tables?.filter(
				(table) =>
					Oracles.isRootNode(table) && Oracles.isShownForSetting(table, setting)
			) ?? []
		return [...rootFolders, ...rootTables]
	}

	/** Return all OracleTables that have a DFID associated with a specific game. */
	static getGameTables(setting: DataforgedNamespace) {
		return game.tables?.filter((tbl) =>
			Boolean(
				tbl.getFlag('dataforged', '$id')?.startsWith(`${setting}/Oracles`)
			)
		)
	}

	static getGameFolders(setting: DataforgedNamespace, topLevelOnly = false) {
		if (game.folders == null)
			throw new Error(
				'The Oracles collection tried to access the Folders collection before initialization.'
			)
		const root = `${setting}/Oracles`
		let testFn: (folder: IronFolder) => boolean

		if (topLevelOnly)
			testFn = (folder) =>
				// check if it has a matching id *and* no provided category parent id
				Boolean(folder.getFlag('dataforged', '$id')?.startsWith(root)) &&
				!folder.getFlag('dataforged', 'Category')
		else
			testFn = (folder) =>
				Boolean(folder.getFlag('dataforged', '$id')?.startsWith(root))

		return game.folders.filter(
			(folder) => folder.type === this.documentName && testFn(folder)
		)
	}

	/** Gets an array of all RollTable folders. */
	get folders() {
		if (game.folders == null)
			throw new Error(
				'The Oracles collection tried to access the Folders collection before initialization.'
			)
		return game.folders.filter((folder) => folder.type === this.documentName)
	}

	static readonly FOLDER_DATA_PATH = {
		Starforged:
			'systems/foundry-ironsworn/assets/oracle-folders-starforged.json',
		Ironsworn: 'systems/foundry-ironsworn/assets/oracle-folders-ironsworn.json'
	} as const

	/**
	 * Writes the oracle category hierarchy to a JSON file so that it can later be rehydrated as a folder tree.
	 * @remarks Part of a workaround for folders not being available in v10 compendia.
	 * @see Oracles#loadTree
	 * @internal
	 */
	static async saveTree(
		game: DataforgedNamespace,
		branches: IOracleCategory[]
	) {
		const path = Oracles.FOLDER_DATA_PATH[game]
		const folderTree = compact(
			await Oracles.buildTree({
				branches,
				mode: 'folders-only',
				folderOptions: { flags: { 'foundry-ironsworn': { visible: false } } },
				folderContext: { temporary: true }
			})
		)
		try {
			await writeFile(path, JSON.stringify(folderTree))
		} catch (error) {
			logger.error(`Couldn't save oracle folder tree to ${path}`)
			return
		}
		logger.info(`Saved oracle folder tree to ${path}`)
	}

	/**
	 * Loads the oracle category hierarchy as a tree of  {@link IronFolder}s.
	 * @remarks Part of a workaround for folders not being available in v10 compendia.
	 * @see Oracles#saveTree
	 * @internal
	 */
	static async loadTree(game: DataforgedNamespace) {
		const path = Oracles.FOLDER_DATA_PATH[game]
		let branches: helpers.SourceDataType<IronFolder>[]
		logger.info(`Loading oracle tree from ${path}`)
		try {
			branches = (await (
				await fetch(path)
			).json()) as helpers.SourceDataType<IronFolder>[]
		} catch {
			logger.error(`Couldn't load oracle folder tree from ${path}`)
			return
		}
		try {
			await IronFolder.createDocuments(branches, { keepId: true })
		} catch {
			logger.error(
				`Couldn't construct oracle tree with the data read from ${path}`
			)
			return
		}
		logger.info(`Loaded and rebuilt oracle tree from ${path}`)
	}

	/**
	 * Load a Dataforged JSON file containing oracle tree data. The deserialized JSON's schema must conform to {@link GameDataRoot}, or else an array of {@link IOracleCategory}
	 * @returns
	 */
	async loadDataforged(url: string) {
		const json = (await foundry.utils.fetchJsonWithTimeout(url, {
			method: 'GET'
		})) as GameDataRoot | IOracleCategory[]

		let categories: IOracleCategory[] | undefined
		if (Array.isArray(json)) {
			categories = json
		} else if (foundry.utils.hasProperty(json as object, 'Oracle Categories')) {
			categories = json['Oracle Categories']
		}
		if (categories == null)
			throw new Error(
				'The JSON root must either be a GameDataRoot object or an array of IOracleCategory'
			)
		return categories
	}

	/**
	 * Builds a representation of the Dataforged oracle tree using FVTT folders.
	 *
	 * @remarks Default context/options will be overridden if the object or its parent provides conflicting data.
	 *
	 * @param branches The top-level category nodes of the Dataforged oracle tree.
	 * @param folderOptions Default constructor options for {@link Folder}s
	 * @param folderContext Default constructor context  for {@link Folder}s
	 * @param tableOptions Default constructor options for {@link OracleTable}s
	 * @param tableContext Default constructor context  for {@link OracleTable}s
	 * @return A Promise containing every constructed {@link Folder}.
	 * @example
	 * ```ts
	 * // import starforged tables
	 * Oracles.fromDataforged(starforged['Oracle Categories'])
	 * ```
	 */
	static async buildTree({
		branches,
		mode = 'all',
		folderOptions = {},
		folderContext = {},
		tableOptions = {},
		tableContext = {}
	}: Oracles.BuildTreeOptions) {
		logger.info('Building oracle tree')
		const result: Array<IronFolder | undefined> = []
		for (const branch of branches) {
			if (!Oracles.isBranch(branch) || !Oracles.isCategoryBranch(branch))
				throw new Error(
					`Dataforged ID "${branch.$id}" doesn't appear to be a valid oracle branch.`
				)

			result.push(
				...(await Oracles.buildBranch({
					branch,
					mode,
					folderOptions,
					folderContext,
					tableOptions,
					tableContext
				}))
			)
		}
		logger.info('Finished building oracle tree')
		return result
	}

	static isCategoryBranch(
		oracle: IOracleBase
	): oracle is IOracleCategoryBranch {
		return Array.isArray(oracle.Categories)
	}

	static isBranch(oracle: IOracleBase): oracle is IOracleBranch {
		return Array.isArray(oracle.Oracles)
	}

	static isLeaf(oracle: IOracleBase): oracle is IOracleLeaf {
		return Array.isArray(oracle.Table)
	}

	static getParentDfId(dfid: string) {
		const sep = '/'
		return dfid.split(sep).slice(0, -2).join(sep)
	}

	/** Convert a Dataforged oracle tree branch into Folder source data.  */
	static getFolderConstructorData(
		data: IOracleCategoryBranch | IOracleBranch
	): helpers.ConstructorDataType<Folder['data']> {
		const parentDfId = data['Member of'] ?? data.Category
		const parent = parentDfId != null ? hashLookup(parentDfId) : null

		return {
			_id: hashLookup(data.$id),
			name: data.Display.Title,
			type: 'RollTable',
			description: data.Description,
			sort: data.Source.Page,
			flags: {
				dataforged: pick(data, '$id', 'Source', 'Category', 'Member of')
			},
			color: data.Display.Color,
			parent
		}
	}

	/**
	 * Recursively constructs a branch of Dataforged's oracle tree. Nodes that conform to {@link IOracleBranch} or {@link IOracleCategoryBranch} are constructed as {@link IronFolder}s. Nodes that conform to {@link IOracleLeaf} are constructed as {@link OracleTable}s.
	 *
	 * @return A flat array of every created {@link Folder} instance, starting with the Folder that represents the supplied `branch` parameter.
	 */
	static async buildBranch({
		branch,
		mode = 'all',
		folderOptions = {},
		folderContext = {},
		tableOptions = {},
		tableContext = {}
	}: Oracles.BuildBranchOptions) {
		logger.info(`Building ${branch.$id}`)

		// folders still need to go through the motions, but shouldn't be stored to db
		if (mode === 'tables-only') folderContext.temporary = true

		const folderData = mergeObject(
			folderOptions as any,
			Oracles.getFolderConstructorData(branch) as any
		) as helpers.ConstructorDataType<IronFolder['data']>

		const folder = (await IronFolder.create(
			folderData,
			folderContext
		)) as IronFolder

		if (folder == null)
			throw new Error(
				`Folder#create returned a nullish value for ${branch.$id} during Dataforged oracle tree construction`
			)

		const folders: Array<IronFolder | undefined> = [folder]

		const folderChildOptions = mergeObject(folderOptions, {
			folder
		}) as helpers.ConstructorDataType<Folder['data']>

		const folderChildContext: DocumentModificationContext = {
			...folderContext,
			parent: folder
		}

		const tableChildOptions = mergeObject(tableOptions, {
			folder
		}) as helpers.ConstructorDataType<RollTable['data']>

		const heritableKeys = ['color', 'flags.dataforged.Source']
		// inherit some properties from parent if they're not already set by Dataforged.
		for (const key of heritableKeys) {
			for (const childOptions of [folderChildOptions, tableChildOptions]) {
				if (foundry.utils.hasProperty(childOptions, key)) {
					setProperty(childOptions, key, getProperty(childOptions, key))
				}
			}
		}

		const buildChildFolder = async (child: IOracleBase) => {
			if (Oracles.isBranch(child) || Oracles.isCategoryBranch(child))
				folders.push(
					...(await Oracles.buildBranch({
						branch: child,
						mode,
						folderOptions: folderChildOptions,
						folderContext: folderChildContext,
						tableOptions: tableChildOptions,
						tableContext
					}))
				)
		}

		if (Oracles.isCategoryBranch(branch))
			for (const child of branch.Categories) {
				await buildChildFolder(child)
			}

		const tablesData: IOracleLeaf[] = []
		if (Oracles.isBranch(branch)) {
			for (const child of branch.Oracles) {
				if (Oracles.isBranch(child)) await buildChildFolder(child)
				if (mode !== 'folders-only' && Oracles.isLeaf(child))
					tablesData.push(child)
			}
		}
		if (mode !== 'folders-only')
			await OracleTable.fromDataforged(
				tablesData,
				tableChildOptions,
				tableContext
			)
		return folders
	}
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Oracles {
	export interface BuildBranchOptions {
		branch: IOracleBranch | IOracleCategoryBranch
		mode?: 'folders-only' | 'tables-only' | 'all'
		folderOptions?: Partial<helpers.ConstructorDataType<Folder['data']>>
		folderContext?: DocumentModificationContext
		tableOptions?: Partial<helpers.ConstructorDataType<RollTable['data']>>
		tableContext?: DocumentModificationContext
	}
	export interface BuildTreeOptions extends Omit<BuildBranchOptions, 'branch'> {
		branches: IOracleCategory[]
	}
	export type Node = IronFolder | OracleTable
}
