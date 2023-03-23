import sfmoveSheetVue from '../../vue/sfmove-sheet.vue'
import { VueItemSheet } from '../../vue/vueitemsheet'
import type { IronswornItem } from '../item'

export class SFMoveSheet extends VueItemSheet<IronswornItem<'sfmove'>> {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			height: 650,
			rootComponent: sfmoveSheetVue
		}) as any
	}
}
