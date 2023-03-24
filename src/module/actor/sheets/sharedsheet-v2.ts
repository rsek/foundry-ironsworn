import sharedSheetVue from '../../vue/shared-sheet.vue'
import { VueActorSheet } from '../../vue/vueactorsheet'
import type { IronswornActor } from '../actor'

export class IronswornSharedSheetV2 extends VueActorSheet<
	IronswornActor<'shared'>
> {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			width: 350,
			height: 700,
			rootComponent: sharedSheetVue
		}) as any
	}
}
