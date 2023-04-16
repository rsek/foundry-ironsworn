import type { Context } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs'
import type { FolderDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/folderData'
import type { RollTableDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/rollTableData'
import type { BaseFolder } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs'
import { hashLookup } from '../dataforged'
import type { IOracleBranch, IOracleLeaf } from '../roll-table/oracle-table'
import { OracleTable } from '../roll-table/oracle-table'
import type { FolderableDocument } from './folder-types'

export class IronFolder<
	T extends FolderableDocument = FolderableDocument
> extends Folder {
	declare data: foundry.data.FolderData & { type: T['documentName'] }
	declare type: T['documentName']
	declare getSubfolders: (
		recursive?: boolean | undefined
	) => Array<IronFolder<T>>

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(
		data?: FolderDataConstructorData & { type: T['documentName'] },
		context?: Context<BaseFolder>
	) {
		super(data, context)
	}

	static async fromDfOracleBranch(
		oracleGroup: IOracleBranch,
		context: Context<BaseFolder> = {},
		oracleContext: DocumentModificationContext = {}
	): Promise<Array<IronFolder<OracleTable>>> {
		// configure data for this folder

		// assemble constructor data for child folders and tables
		const folderChildrenData: IOracleBranch[] = oracleGroup?.Categories ?? []
		const tableChildrenData: RollTableDataConstructorData[] = []

		const parentFolder = (await IronFolder.create(
			{
				_id: hashLookup(oracleGroup.$id),
				name: oracleGroup.Display.Title,
				type: 'RollTable',
				description: oracleGroup.Description,
				sort: oracleGroup.Source.Page,
				flags: {
					'foundry-ironsworn': {
						dfid: oracleGroup.$id
					}
				},
				keepId: true,
				keepEmbeddedIds: true
			},
			context
		)) as IronFolder<OracleTable>

		for (const child of oracleGroup?.Oracles ?? []) {
			if (child.Categories != null || child.Oracles != null)
				folderChildrenData.push(child as IOracleBranch)
			else if (child.Table != null) {
				const childData = OracleTable.fromDataforged(child as IOracleLeaf)
				childData.folder = parentFolder
				tableChildrenData.push(childData)
			}
		}

		const results = [parentFolder]

		for await (const child of folderChildrenData) {
			results.push(
				...(await IronFolder.fromDfOracleBranch(
					child,
					context,
					mergeObject(context, { parent: parentFolder }) as Context<BaseFolder>
				))
			)
		}

		await OracleTable.createDocuments(tableChildrenData, {
			...oracleContext,
			parent: parentFolder
		})

		return results
	}
}
