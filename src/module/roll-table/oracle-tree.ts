import type {
	GameDataRoot,
	IOracleBase,
	IOracleCategory,
	RequireKey
} from 'dataforged'
import { hashLookup, pickDataforged } from '../dataforged'
import type {
	IOracleBranch,
	IOracleCategoryBranch,
	IOracleLeaf
} from './roll-table-types'
import { OracleTable } from './oracle-table'
import { IronFolder } from '../folder/folder'
import { compact, pick, pickBy } from 'lodash-es'
import type { helpers } from '../../types/utils'
import { writeFileSync } from 'fs'
import { ISOracleCategories, SFOracleCategories } from '../dataforged/data'
import { ConfiguredFlags } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'

type DataforgedNamespace = 'Starforged' | 'Ironsworn'

/**
 * Extends FVTT's {@link RollTables} to manage the Dataforged oracle tree.
 * @remarks This is a singleton at runtime, but it intentionally implements its Ironsworn-specific static methods so that they're available as (e.g.) `OracleTree.findDfId()` instead of `game.tables?.findDfId()`.
 */
export class OracleTree extends RollTables {
	static async flushOracles({
		setting,
		mode = 'all'
	}: {
		setting?: DataforgedNamespace
		mode?: 'omit-folders' | 'omit-tables' | 'all'
	} = {}) {
		if (mode !== 'omit-tables')
			for (const table of game.tables?.contents ?? []) {
				const isCanonical =
					table.getFlag('foundry-ironsworn', 'canonical') ?? false
				const hasSetting =
					setting == null ? true : table.dfid?.startsWith(setting) ?? false
				if (isCanonical && hasSetting) void table.delete()
			}
		if (mode !== 'omit-folders')
			for (const folder of game.folders?.contents ?? []) {
				const isCanonical =
					folder.getFlag('foundry-ironsworn', 'canonical') ?? false
				const hasSetting =
					setting == null ? true : folder.dfid?.startsWith(setting) ?? false
				if (folder.type === 'RollTable' && isCanonical && hasSetting)
					void folder.delete()
			}
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
	): StoredDocument<OracleTree.Node> | undefined
	static findDfId(
		dfid: string,
		includeFolders = false
	): StoredDocument<OracleTree.Node> | undefined {
		if (includeFolders) {
			if (game.folders == null)
				throw new Error('game.folders has not been initialized')
			const folder = game.folders.find(
				(folder) => folder.type === 'RollTable' && folder.dfid === dfid
			) as StoredDocument<IronFolder<OracleTable>>
			if (folder != null) return folder
		}

		if (game.tables == null)
			throw new Error('game.tables has not been initialized')
		return game.tables.find((tbl) => tbl.dfid === dfid)
	}

	/**
	 * Returns an array of a Dataforged oracle tree node  with its ancestor folders, or `null` if no matching node is found.
	 * @returns An array ordered by distance from the identified oracle node, beginning with it's "top-level" folder ancestor and ending with the node itself.
	 */
	static findWithAncestors(dfid: string) {
		const target = OracleTree.findDfId(dfid, true)
		if (target == null) return null
		const ancestors = [target]
		let current: OracleTree.Node | null = target
		while (current != null) {
			if (current.parent != null)
				ancestors.unshift(current.parent as StoredDocument<OracleTree.Node>)
			current = current.parent as OracleTree.Node | null
		}
		return ancestors
	}

	/** Is the node a root node (e.g. without a parent folder?)  */
	static isRootNode(node: OracleTree.Node) {
		return node.folder == null
	}

	/** Should the node be rendered in the oracle tree for this setting? */
	static isShownForSetting(
		node: OracleTree.Node,
		setting: DataforgedNamespace
	) {
		const flg = node.dfid
		return flg == null || flg.startsWith(setting)
	}

	/** Returns the root nodes for a given setting */
	static getRootNodes(setting: DataforgedNamespace) {
		const rootFolders =
			game.folders?.filter(
				(folder) =>
					folder.type === 'RollTable' &&
					OracleTree.isRootNode(folder as IronFolder<OracleTable>) &&
					OracleTree.isShownForSetting(
						folder as IronFolder<OracleTable>,
						setting
					)
			) ?? []
		// our tables don't do this, but user custom tables might
		const rootTables =
			game.tables?.filter(
				(table) =>
					OracleTree.isRootNode(table) &&
					OracleTree.isShownForSetting(table, setting)
			) ?? []
		return [...rootFolders, ...rootTables]
	}

	/** Return all OracleTables that have a DFID associated with a specific game. */
	static getGameTables(setting: DataforgedNamespace) {
		return game.tables?.filter((tbl) =>
			Boolean(tbl.dfid?.startsWith(`${setting}/Oracles`))
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
				Boolean(folder.dfid?.startsWith(root)) &&
				Boolean(folder.parentFolder?.dfid)
		else testFn = (folder) => Boolean(folder.dfid?.startsWith(root))

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
			'systems/foundry-ironsworn/assets/folders/starforged-oracles.json',
		Ironsworn: 'systems/foundry-ironsworn/assets/folders/ironsworn-oracles.json'
	} as const

	/**
	 * Writes the oracle category hierarchy to a JSON file so that it can later be rehydrated as a folder tree.
	 * @remarks Part of a workaround for folders not being available in v10 compendia.
	 * @see OracleTree#loadTree
	 * @internal
	 */
	static async saveTree(folders: IronFolder[], game: DataforgedNamespace) {
		const path = OracleTree.FOLDER_DATA_PATH[game]

		const data = folders.map((folder) =>
			pickBy(folder.toObject(), (v, k) => {
				const omitKeys = ['_stats', 'sorting']
				if (v == null) return false
				if (typeof v === 'string' && v.length === 0) return false
				if (omitKeys.includes(k)) return false
				return true
			})
		)

		console.log(data)
		// writeFileSync(path, JSON.stringify(data))

		// logger.info(`Saved oracle folder tree to ${path}`)
	}

	/**
	 * Loads the oracle category hierarchy as a tree of  {@link IronFolder}s.
	 * @remarks Part of a workaround for folders not being available in v10 compendia.
	 * @see OracleTree#saveTree
	 * @internal
	 */
	static async loadTree(setting: DataforgedNamespace) {
		const path = OracleTree.FOLDER_DATA_PATH[setting]
		let branches: helpers.SourceDataType<IronFolder>[]
		logger.info(`Loading oracle tree from ${path}`)
		try {
			branches = (await (
				await fetch(path)
			).json()) as helpers.SourceDataType<IronFolder>[]

			await this.flushOracles({ setting })
			await IronFolder.createDocuments(branches, {
				keepId: true,
				keepEmbeddedIds: true
			})
		} catch {
			logger.error(`Couldn't load oracle folder tree from ${path}`)
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
	 * OracleTree.fromDataforged(starforged['Oracle Categories'])
	 * ```
	 */
	static async buildTree({
		branches = [...SFOracleCategories, ...ISOracleCategories],
		mode = 'all',
		folderOptions = {},
		folderContext = { keepId: true },
		tableOptions = {},
		tableContext = { keepId: true }
	}: OracleTree.BuildTreeOptions) {
		logger.info('Building oracle tree')

		await this.flushOracles({ mode })

		const result: Array<IronFolder | undefined> = []
		for (const branch of branches) {
			if (!OracleTree.isBranch(branch) && !OracleTree.isCategoryBranch(branch))
				throw new Error(
					`Dataforged ID "${branch.$id}" doesn't appear to be a valid oracle branch.`
				)

			result.push(
				...(await OracleTree.buildBranch({
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
		if (Array.isArray(oracle.Table)) return false
		return Array.isArray(oracle.Categories)
	}

	static isBranch(oracle: IOracleBase): oracle is IOracleBranch {
		if (Array.isArray(oracle.Table)) return false
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
		const parentFolder = parentDfId != null ? hashLookup(parentDfId) : null

		const flags: RequireKey<ConfiguredFlags<'Folder'>, 'foundry-ironsworn'> = {
			'foundry-ironsworn': {
				dfid: data.$id
			}
		}
		if (this.isBranch(data))
			flags['foundry-ironsworn'].dataforged = pickDataforged(
				data,
				'Display',
				'Source',
				'Category',
				'Member of',
				'Aliases',
				'Usage'
			)
		else if (this.isCategoryBranch(data))
			flags['foundry-ironsworn'].dataforged = pickDataforged(
				data,
				'Display',
				'Source',
				'Category',
				'Member of',
				'Aliases',
				'Usage',
				'Sample Names'
			)

		// strip redundant flags
		setProperty(flags, 'foundry-ironsworn.dataforged.Display.Title', undefined)
		setProperty(flags, 'foundry-ironsworn.dataforged.Display.Color', undefined)

		return {
			_id: hashLookup(data.$id),
			// remove "Oracle XX: " from some classic oracle titles
			name: data.Display.Title.replace(/^Oracle [0-9]+: /, ''),
			type: 'RollTable',
			description: data.Description,
			sort: data.Source.Page,
			flags,
			color: data.Display.Color,
			parent: parentFolder
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
	}: OracleTree.BuildBranchOptions) {
		logger.info(`Building ${branch.$id}`)

		// folders still need to go through the motions, but shouldn't be stored to db
		if (mode === 'omit-folders') folderContext.temporary = true

		const folderData = this.getFolderConstructorData(branch)
		setProperty(folderData, 'flags.foundry-ironsworn.canonical', true)

		const folder = (await IronFolder.create(
			{ ...folderOptions, ...folderData },
			folderContext
		)) as IronFolder

		// await folder.setFlag('foundry-ironsworn', 'canonical', true)

		if (folder == null)
			throw new Error(
				`Folder#create returned a nullish value for ${branch.$id} during Dataforged oracle tree construction`
			)

		const folders: Array<IronFolder | undefined> = [folder]

		const folderChildOptions: Partial<
			helpers.ConstructorDataType<Folder['data']>
		> = {
			color: folderData.color,
			...folderOptions,
			parent: folderData._id
		}

		const tableChildOptions: Partial<
			helpers.ConstructorDataType<RollTable['data']>
		> = { ...tableOptions, folder: folderData._id }
		setProperty(tableChildOptions, 'flags.foundry-ironsworn.canonical', true)

		// inherit some properties from parent if they're not already set by Dataforged.
		for (const childOptions of [folderChildOptions, tableChildOptions]) {
			const key = 'flags.foundry-ironsworn.dataforged.Source'
			if (foundry.utils.hasProperty(childOptions, key)) {
				setProperty(childOptions, key, getProperty(childOptions, key))
			}
		}

		const buildChildFolder = async (folderChild: IOracleBase) => {
			if (
				OracleTree.isBranch(folderChild) ||
				OracleTree.isCategoryBranch(folderChild)
			)
				folders.push(
					...(await OracleTree.buildBranch({
						branch: folderChild,
						mode,
						folderOptions: folderChildOptions,
						folderContext,
						tableOptions: tableChildOptions,
						tableContext
					}))
				)
		}

		if (OracleTree.isCategoryBranch(branch))
			for (const child of branch.Categories) {
				await buildChildFolder(child)
			}

		const tablesData: IOracleLeaf[] = []
		if (OracleTree.isBranch(branch)) {
			for (const tableChild of branch.Oracles) {
				if (OracleTree.isBranch(tableChild)) await buildChildFolder(tableChild)
				else if (mode !== 'omit-tables' && OracleTree.isLeaf(tableChild))
					tablesData.push(tableChild)
			}
		}
		if (mode !== 'omit-tables') {
			// these don't need to be awaited
			void OracleTable.fromDataforged(
				tablesData,
				tableChildOptions,
				tableContext
			)
		}
		return folders
	}
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace OracleTree {
	export interface BuildBranchOptions {
		branch: IOracleBranch | IOracleCategoryBranch
		mode?: 'omit-tables' | 'omit-folders' | 'all'
		folderOptions?: Partial<helpers.ConstructorDataType<Folder['data']>>
		folderContext?: DocumentModificationContext
		tableOptions?: Partial<helpers.ConstructorDataType<RollTable['data']>>
		tableContext?: DocumentModificationContext
	}
	export interface BuildTreeOptions extends Omit<BuildBranchOptions, 'branch'> {
		branches: IOracleCategory[]
	}
	export type Node = IronFolder<OracleTable> | OracleTable
}
