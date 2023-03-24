import sfLocationsheetVue from '../../vue/sf-locationsheet.vue'
import { VueActorSheet } from '../../vue/vueactorsheet'
import type { IronswornActor } from '../actor'

export class StarforgedLocationSheet extends VueActorSheet<
	IronswornActor<'location'>
> {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			width: 600,
			height: 600,
			rootComponent: sfLocationsheetVue
		}) as any
	}
}
