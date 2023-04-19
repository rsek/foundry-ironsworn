import { OracleTable } from '../roll-table/oracle-table'
import { FolderableDocument } from './folder-types'

export class IronFolder extends Folder {
	override get visible() {
		const flg = this.getFlag('foundry-ironsworn', 'visible')
		if (typeof flg === 'boolean') return flg
		return super.visible
	}

	/** The Dataforged ID of the node represented by this folder, if any */
	get dfid() {
		return this.getFlag('dataforged', '$id')
	}

	// fromOracleTableStub(oracleTable: OracleTable) {

	// }
}
