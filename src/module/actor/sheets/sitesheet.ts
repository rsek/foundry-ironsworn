import { VueActorSheet } from '../../vue/vueactorsheet'
import siteSheetVue from '../../vue/site-sheet.vue'
import type { IronswornItem } from '../../item/item'
import type { IronswornActor } from '../actor'

export class IronswornSiteSheet extends VueActorSheet<IronswornActor<'site'>> {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			width: 750,
			height: 700,
			rootComponent: siteSheetVue
		})
	}

	// TODO: write a type declaration fix for this
	// @ts-expect-error
	async _onDropItem<T extends IronswornItem>(
		event: ElementDragEvent,
		data: DropCanvasData<'Item', T>
	) {
		// Fetch the item. We only want to override denizens (progress-type items)
		const item = await Item.fromDropData(data)
		if (item == null) return false
		if (item.type !== 'progress') {
			return await super._onDropItem(event, data)
		}

		// Find which denizen slot this is going into
		const dropTarget = $(event.target).parents('.ironsworn__denizen__drop')[0]
		if (!dropTarget) return false
		const idx = parseInt(dropTarget.dataset.idx ?? '')
		const { denizens } = this.actor.system
		if (!denizens[idx]) return false

		// Set the denizen description
		denizens[idx].text = item.link
		this.actor.update({ system: { denizens } }, { render: true })
		return true
	}
}
