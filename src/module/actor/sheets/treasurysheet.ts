import treasurySheetVue from '../../vue/treasury-sheet.vue'
import { VueActorSheet } from '../../vue/vueactorsheet'

export class TreasurySheet extends VueActorSheet {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			width: 475,
			height: 700,
			rootComponent: treasurySheetVue
		}) as any
	}
}
