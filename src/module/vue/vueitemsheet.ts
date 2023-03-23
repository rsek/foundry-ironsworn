import type { App } from 'vue'
import { $ItemKey } from './provisions'
import type { VueApplicationOptions } from './vueapp.js'
import { VueAppMixin } from './vueapp.js'
import type { IronswornItem } from '../item/item'

export abstract class VueItemSheet<T extends IronswornItem> extends VueAppMixin(
	ItemSheet
) {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['ironsworn', 'item'],
			width: 520,
			height: 480
		})
	}

	get item() {
		return super.item as T
	}

	setupVueApp(app: App) {
		app.provide($ItemKey, this.item)
	}

	override async getData(options?: Partial<VueApplicationOptions>) {
		const data = await super.getData(options)
		return {
			...data,
			item: this.item.toObject()
		} as any
	}

	readonly hasEditMode: boolean = true
	_getHeaderButtons() {
		if (this.hasEditMode) {
			return [
				{
					class: 'ironsworn-toggle-edit-mode',
					label: game.i18n.localize('IRONSWORN.Edit'),
					icon: 'fas fa-edit',
					onclick: (e) => {
						this._toggleEditMode(e)
					}
				},
				...super._getHeaderButtons()
			]
		}
		return super._getHeaderButtons()
	}

	_toggleEditMode(_e: JQuery.ClickEvent) {
		const currentValue = this.item.getFlag('foundry-ironsworn', 'edit-mode')
		this.item.setFlag('foundry-ironsworn', 'edit-mode', !currentValue)
	}
}
