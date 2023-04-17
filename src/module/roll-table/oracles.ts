import type { Context } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs'
import type { RollTableDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/rollTableData'
import type { BaseFolder } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs'
import type { ConfiguredFlags } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import type { IOracleBase, IOracleCategory } from 'dataforged'
import { hashLookup } from '../dataforged'
import type {
	IOracleBranch,
	IOracleCategoryBranch,
	IOracleLeaf,
	OracleConstructorDataStub
} from './roll-table-types'
import { OracleTable } from './oracle-table'
import type { FolderDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/folderData'

/** Extends FVTT's {@link RollTables} so it can better manage the Dataforged oracle tree. */
export class Oracles extends RollTables {
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
	 * Oracles.importDataforged(starforged['Oracle tables'])
	 * ```
	 *
	 */
	static async fromDataforged(
		branches: IOracleCategory[],
		folderOptions: Partial<FolderDataConstructorData> = {},
		folderContext: Context<BaseFolder> = {},
		tableOptions: OracleConstructorDataStub = {},
		tableContext: DocumentModificationContext = {}
	) {
		logger.info('Building oracle tree')
		const result: Array<Folder | undefined> = []
		for (const branch of branches) {
			result.push(
				...(await Oracles.buildBranch(
					branch as IOracleCategoryBranch,
					folderOptions,
					folderContext,
					tableOptions,
					tableContext
				))
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

	/** Convert a Dataforged oracle tree branch into Folder source data.  */
	static getFolderConstructorData(
		data: IOracleCategoryBranch | IOracleBranch
	): FolderDataConstructorData {
		return {
			_id: hashLookup(data.$id),
			name: data.Display.Title,
			type: 'RollTable',
			description: data.Description,
			sort: data.Source.Page,
			flags: {
				'foundry-ironsworn': {
					dfid: data.$id
				}
			},
			color: data.Display.Color
		}
	}

	/**
	 * Recursively constructs a branch of Dataforged's oracle tree.
	 *
	 * Nodes that conform to {@link IOracleBranch} or {@link IOracleCategoryBranch} are constructed as  {@link Folder}s.
	 *
	 * Nodes that conform to {@link IOracleLeaf} are constructed as {@link OracleTable}s.
	 *
	 * @return A flat array of every created {@link Folder} instance, starting with the Folder that represents the ancestor node.
	 */
	static async buildBranch(
		branch: IOracleBranch | IOracleCategoryBranch,
		options: Partial<FolderDataConstructorData> = {},
		context: Context<BaseFolder> = {},
		tableOptions: OracleConstructorDataStub = {},
		tableContext: DocumentModificationContext = {}
	) {
		logger.info(`Building ${branch.$id}`)

		const folderData = mergeObject(
			options,
			Oracles.getFolderConstructorData(branch)
		) as FolderDataConstructorData

		const folder = (await Folder.create(folderData, context)) as Folder

		if (folder == null)
			throw new Error(
				`Folder#create returned a nullish value for ${branch.$id} during Dataforged oracle tree construction`
			)

		if (folder.getFlag('foundry-ironsworn', 'parentDfid') == null) {
			/**
			 * Top-level categories can't get these from a parent folder. So, we compute one that doesn't correspond to an actual folder, and use it to identify top-level categories later
			 */
			const fakeParentId = branch.$id.split('/').slice(0, -2).join('/') as
				| `Starforged/Oracles`
				| `Ironsworn/Oracles`
			await folder.setFlag('foundry-ironsworn', 'parentDfid', fakeParentId)
		}

		const folders: Array<Folder | undefined> = [folder]

		/** Passed to each child so that the oracle tree can be reconstructed from v10 compendium packs. */
		const childFlags: ConfiguredFlags<'Folder' | 'RollTable'> = {
			'foundry-ironsworn': {
				parentDfid: folderData.flags?.['foundry-ironsworn'].dfid
			}
		}

		const folderChildOptions = mergeObject(options, {
			folder,
			flags: childFlags
		}) as FolderDataConstructorData

		const folderChildContext: Context<BaseFolder> = {
			...context,
			parent: folder
		}

		const tableChildOptions = mergeObject(tableOptions, {
			folder,
			flags: childFlags
		}) as RollTableDataConstructorData

		// inherit some properties from parent if they're not already set by Dataforged.
		if (folderChildOptions.color == null)
			folderChildOptions.color = folderData.color
		if (folderChildOptions.sort == null)
			folderChildOptions.sort = folderData.sort
		if (tableChildOptions.sort == null) tableChildOptions.sort = folderData.sort

		const buildChildFolder = async (child: IOracleBase) => {
			if (Oracles.isBranch(child) || Oracles.isCategoryBranch(child))
				folders.push(
					...(await Oracles.buildBranch(
						child,
						folderChildOptions,
						folderChildContext,
						tableChildOptions,
						tableContext
					))
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
				if (Oracles.isLeaf(child)) tablesData.push(child)
			}
		}

		await OracleTable.fromDataforged(
			tablesData,
			tableChildOptions,
			tableContext
		)
		return folders
	}
}
