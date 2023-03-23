import { VueItemSheet } from '../../vue/vueitemsheet'
import delveThemeDomainSheet from '../../vue/delve-theme-domain-sheet.vue'
import type { IronswornItem } from '../item'

export class ThemeDomainSheet extends VueItemSheet<
	IronswornItem<'delve-theme' | 'delve-domain'>
> {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			height: 650,
			rootComponent: delveThemeDomainSheet
		} as any)
	}
}
