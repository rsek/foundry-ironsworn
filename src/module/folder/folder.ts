import { OracleTable } from '../roll-table/oracle-table'
import { FolderableDocument } from './folder-types'

export class IronFolder extends Folder {
	// override get visible() {
	// 	const flg = this.getFlag('foundry-ironsworn', 'canonical')
	// 	if (flg === true) return false
	// 	return super.visible
	// }
	get canonical() {
		return Boolean(this.getFlag('foundry-ironsworn', 'canonical'))
	}

	/** The Dataforged ID of the node represented by this folder, if any */
	get dfid() {
		return this.getFlag('foundry-ironsworn', 'dataforged')?.dfid
	}

	// fromOracleTableStub(oracleTable: OracleTable) {

	// }
}
