import ledgerEntrySheetVue from '../../vue/ledger-entry-sheet.vue'
import { VueItemSheet } from '../../vue/vueitemsheet'

export class LedgerEntrySheet extends VueItemSheet {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			height: 550,
			rootComponent: ledgerEntrySheetVue
		}) as any
	}

	readonly hasEditMode = false
}
