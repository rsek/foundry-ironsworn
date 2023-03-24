import starshipSheetVue from '../../vue/starship-sheet.vue'
import { VueActorSheet } from '../../vue/vueactorsheet'
import type { IronswornActor } from '../actor'

export class StarshipSheet extends VueActorSheet<IronswornActor<'starship'>> {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			width: 500,
			height: 500,
			rootComponent: starshipSheetVue
		}) as any
	}
}
