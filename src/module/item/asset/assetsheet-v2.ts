import assetSheetVue from '../../vue/asset-sheet.vue'
import { VueItemSheet } from '../../vue/vueitemsheet'
import type { IronswornItem } from '../item'

export class AssetSheetV2 extends VueItemSheet<IronswornItem<'asset'>> {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			width: 450,
			rootComponent: assetSheetVue
		})
	}
}
