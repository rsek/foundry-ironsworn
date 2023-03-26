import type { App } from 'vue'
import type { IronswornActor } from '../actor/actor'
import type { IronswornItem } from '../item/item'
import { $ActorKey } from './provisions'
import type { Constructor } from './vueapp.js'
import { VueAppMixin } from './vueapp.js'

export abstract class VueActorSheet<
	T extends IronswornActor
> extends VueAppMixin<Constructor<ActorSheet<IronswornActor, IronswornItem>>>(
	ActorSheet
) {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['actor', 'ironsworn']
		})
	}

	setupVueApp(app: App) {
		app.provide($ActorKey, this.actor)
	}

	override async getData(...args) {
		const data = await super.getData(...args)
		return {
			...data,
			actor: this.actor.toObject()
		} as ActorSheetData<T>
	}

	get actor(): T {
		return super.actor as T
	}

	async close(...args) {
		await this.actor.moveSheet?.close(...args)
		await super.close(...args)
	}

	_getHeaderButtons() {
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

	_toggleEditMode(e: JQuery.ClickEvent) {
		e.preventDefault()

		const currentValue = this.actor.getFlag(
			'foundry-ironsworn',
			'edit-mode'
		) as boolean
		this.actor.setFlag('foundry-ironsworn', 'edit-mode', !currentValue)
	}

	protected async _onDrop(event: ElementDragEvent) {
		const data = TextEditor.getDragEventData(event) as any

		if (data?.type === 'AssetBrowserData') {
			const document = (await fromUuid(data.uuid)) as
				| IronswornItem<'asset'>
				| undefined

			if (document != null) {
				await this.actor.createEmbeddedDocuments('Item', [document.toObject()])
			}
		}

		super._onDrop(event)
	}
}
