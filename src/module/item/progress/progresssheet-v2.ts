import progressSheetVue from '../../vue/progress-sheet.vue'
import { VueItemSheet } from '../../vue/vueitemsheet'
import type { IronswornItem } from '../item'

export class ProgressSheetV2 extends VueItemSheet<IronswornItem<'progress'>> {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			height: 550,
			rootComponent: progressSheetVue
		}) as any
	}

	readonly hasEditMode = false
}
