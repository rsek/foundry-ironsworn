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
import { compact, pickBy } from 'lodash-es'
import type { helpers } from '../../types/utils'
import { ISOracleCategories, SFOracleCategories } from '../dataforged/data'
import type { ConfiguredFlags } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'

export type DataforgedNamespace = 'Starforged' | 'Ironsworn'

/**
 * Extends FVTT's {@link RollTables} to manage the Dataforged oracle tree.
 * @remarks This is a singleton at runtime, but it intentionally implements its Ironsworn-specific static methods so that they're available as (e.g.) `OracleTree.findDfId()` instead of `game.tables?.findDfId()`.
 */
export class OracleTree extends RollTables {
	/**
	 * Find an oracle tree node by its Dataforged ID.
	 * @param dfid The Dataforged ID to find.
	 * @param includeFolders Should {@link IronFolder} results be included?
	 */
	static find(
		dfid: string,
		includeFolders?: false
	): StoredDocument<OracleTable> | undefined
	static find(
		dfid: string,
		includeFolders: true
	): StoredDocument<OracleTree.Node> | undefined
	static find(
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

	static query(q: string, setting: DataforgedNamespace) {
		let pattern: RegExp | null
		try {
			pattern = new RegExp(q, 'i')
		} catch {
			pattern = null
		}
		if (q == null || pattern == null) return

		const results = new Set<OracleTree.Node>()
		// Walk the tree and test each name.
		// Force expanded on all parent nodes leading to a match
		// iterate tables first
		const queryNode = (node: OracleTree.Node) => {
			// console.log(node)
			if (node == null) return false
			if (![setting, undefined].includes(node.setting)) return false

			const matchableNames: string[] = []

			const df = node.dataforged as { Aliases?: string[] }

			if (df?.Aliases != null) matchableNames.push(...df.Aliases)
			if (node.name != null) matchableNames.push(node.name)

			// console.log(namesToTest)

			if (!matchableNames.some((alias) => pattern?.test(alias))) return false

			results.add(node)

			for (const ancestor of node.ancestors) results.add(ancestor)

			if (node.documentName === 'Folder')
				for (const content of node.contents) results.add(content)

			return true
		}

		for (const node of game.tables ?? []) queryNode(node)
		for (const node of (game.folders ?? []) as IronFolder<OracleTable>[])
			queryNode(node)

		return Array.from(results).sort((a, b) => a.sort - b.sort)
	}

	static getNodes(
		setting?: DataforgedNamespace,
		rootOnly = false,
		fn?: (node: OracleTree.Node) => boolean
	): (OracleTree.Node & { id: string })[] {
		const tests: ((node: unknown) => boolean)[] = []

		if (setting != null)
			tests.push((node) => OracleTree.isSettingNode(node, setting))
		if (rootOnly) tests.push(OracleTree.isRootNode)
		if (tests.length === 0) tests.push(OracleTree.isNode)
		// the previous type guards should ensure the type here
		if (fn != null) tests.push(fn as (node: unknown) => boolean)
		const allNodes = [
			...(game.tables ?? []),
			...(game.folders ?? [])
		] as (OracleTree.Node & { id: string })[]

		if (tests.length === 0) return allNodes

		return allNodes
			.filter((node) => tests.every((test) => test(node)))
			.sort((a, b) => a.sort - b.sort)
	}

	/*********************************
	 * Dataforged adaption
	 *********************************/

	static readonly FOLDER_DATA_PATH = {
		Starforged:
			'systems/foundry-ironsworn/assets/folders/starforged-oracles.json',
		Ironsworn: 'systems/foundry-ironsworn/assets/folders/ironsworn-oracles.json'
	} as const

	static async sweepCanonical({
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

	static async emptySettingPack(setting: DataforgedNamespace) {
		const packId = `foundry-ironsworn.${setting.toLowerCase()}oracles`
		const pack = game.packs.get(packId)
		if (pack == null) throw new Error(`Pack ${packId} not found`)

		// unlock pack and begin deleting
		await pack.configure({ locked: false })

		if (!pack.indexed) await pack.getIndex()

		const keys = Array.from(pack.index.keys())
		if (keys.length === 0) throw new Error('No keys to delete')
		await OracleTable.deleteDocuments(keys, {
			pack: packId
		})
		return pack
	}

	/** Saves all canonical tables to the appropriate pack. */
	static async saveToPack(setting: DataforgedNamespace) {
		const tables = game.tables?.filter((table) => table.setting === setting)
		if (tables == null || tables.length === 0)
			throw new Error(`No tables available for setting ${setting}`)

		const pack = await OracleTree.emptySettingPack(setting)

		// add tables to compendium
		for await (const table of tables)
			await pack.importDocument(table, {
				clearPermissions: true,
				keepId: true,
				clearSort: false,
				clearState: true
			})
		// TODO: figure out a way to ensure that user-imported tables arent canonical by default

		// TODO: is there a way that tables could be brought in on-demand, using the index?

		await pack.configure({ locked: true })
		logger.info(
			`Finished rebuilding ${pack.name} with ${tables.length} OracleTables`
		)
	}

	/**
	 * Writes the oracle category hierarchy to a JSON file so that it can later be rehydrated as a folder tree.
	 * @remarks Part of a workaround for folders not being available in v10 compendia.
	 * @see OracleTree#loadTree
	 * @internal
	 */
	static async saveTree(folders: IronFolder[], game: DataforgedNamespace) {
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

			await OracleTree.sweepCanonical({ setting })
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
	static async loadDataforged(url: string) {
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

		await OracleTree.sweepCanonical({ mode })

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

	/** Convert a Dataforged oracle tree branch into Folder source data.  */
	static getFolderConstructorData(
		data: IOracleCategoryBranch | IOracleBranch
	): helpers.ConstructorDataType<Folder['data']> {
		const parentDfid = data['Member of'] ?? data.Category
		const parentFolder = parentDfid != null ? hashLookup(parentDfid) : null

		const flags: RequireKey<ConfiguredFlags<'Folder'>, 'foundry-ironsworn'> = {
			'foundry-ironsworn': {
				dfid: data.$id,
				parentDfid
			}
		}

		// HACK: infer a page number if the category doesn't specify one
		// these won't be 100% correct but are good enough to provide a sensible sort order
		if (typeof data.Source.Page === 'undefined') {
			const childPages = [...(data.Categories ?? []), ...(data.Oracles ?? [])]
				.filter((child) => child.Source.Title === data.Source.Title)
				.map((child) => child.Source.Page)
			// inference: lowest page is closest to start of category section
			data.Source.Page = Math.min(...compact(childPages))
		}

		if (OracleTree.isBranch(data))
			flags['foundry-ironsworn'].dataforged = pickDataforged(
				data,
				'Display',
				'Source',
				'Aliases',
				'Usage'
			)
		else if (OracleTree.isCategoryBranch(data))
			flags['foundry-ironsworn'].dataforged = pickDataforged(
				data,
				'Display',
				'Source',
				'Aliases',
				'Usage',
				'Sample Names'
			)

		// strip unneeded/redundant flags
		const toStrip = [
			'Display.Title',
			'Display.Color',
			'Display.Table',
			'Source.Date'
		]
		toStrip.forEach((key) =>
			setProperty(flags, `foundry-ironsworn.dataforged.${key}`, undefined)
		)

		if (flags['foundry-ironsworn'].dataforged?.Display.Images != null) {
			flags['foundry-ironsworn'].dataforged.Display.Images = flags[
				'foundry-ironsworn'
			].dataforged.Display.Images.map((img) =>
				img.replace(
					/^.*img\/raster\/webp\/planet\//,
					'systems/foundry-ironsworn/assets/planets/'
				)
			)
		}

		if (flags['foundry-ironsworn'].dataforged?.Display.Icon != null) {
			flags['foundry-ironsworn'].dataforged.Display.Icon = flags[
				'foundry-ironsworn'
			].dataforged.Display.Icon.replace(
				/^.*img\/vector\//,
				'systems/foundry-ironsworn/assets/icons/'
			)
		}

		let sort: number = data.Source.Page ?? 0

		// HACK: lazy way to bump delve content to the end. it'd be better to genericize this so it can gracefully handle future content
		if (data.Source.Title === 'Ironsworn: Delve') sort += 1000

		// More specific/opinionated sorting
		switch (data.$id) {
			case 'Starforged/Oracles/Core':
				sort = 1
				break
			case 'Starforged/Oracles/Vaults/Interior':
			case 'Starforged/Oracles/Vaults/Sanctum':
				sort += 10
				break
			case 'Starforged/Oracles/Moves':
			case 'Ironsworn/Oracles/Moves':
				sort += 2000
				break
			default:
				break
		}

		return {
			_id: hashLookup(data.$id),
			// remove "Oracle XX: " from some classic oracle titles
			name: data.Display.Title.replace(/^Oracle [0-9]+: /, ''),
			type: 'RollTable',
			description: data.Description,
			sort,
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

		const folderData = OracleTree.getFolderConstructorData(branch)
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

	/*********************************
	 * Type guards
	 *********************************/

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

	/** Is the node a root node (e.g. without a parent folder?)  */
	static isRootNode(
		node: unknown
	): node is OracleTree.Node & { id: string; folder: null } {
		const parent = (node as any)?.folder ?? (node as any)?.parentFolder
		return OracleTree.isNode(node) && parent == null
	}

	/** Should the node be rendered in the oracle tree for this setting? */
	static isSettingNode(
		node: unknown,
		setting: DataforgedNamespace
	): node is OracleTree.Node {
		if (!OracleTree.isNode(node)) return false
		return [setting, undefined].includes(node.setting)
	}

	static isNode(node: unknown): node is OracleTree.Node & { id: string } {
		return (
			(node instanceof IronFolder &&
				node.type === 'RollTable' &&
				typeof node.id === 'string') ||
			(node instanceof OracleTable && typeof node.id === 'string')
		)
	}
}

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
