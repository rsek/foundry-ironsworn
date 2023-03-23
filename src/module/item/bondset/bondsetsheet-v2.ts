import bondsetSheetVue from '../../vue/bondset-sheet.vue'
import { VueItemSheet } from '../../vue/vueitemsheet'
import type { IronswornItem } from '../item'

export class BondsetSheetV2 extends VueItemSheet<IronswornItem<'bondset'>> {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			width: 800,
			rootComponent: bondsetSheetVue
		}) as any
	}
}
