import type { FolderableDocument } from './folder-types'

export class IronFolder<
	T extends FolderableDocument = FolderableDocument
> extends Folder {
	override get parentFolder() {
		return super.parentFolder as this | null
	}

	override get type() {
		return super.type as T['documentName']
	}

	get canonical() {
		return Boolean(this.getFlag('foundry-ironsworn', 'canonical'))
	}

	/** The Dataforged ID of the node represented by this folder, if any */
	get dfid() {
		return this.getFlag('foundry-ironsworn', 'dfid')
	}
}
