import type { App } from 'vue'
import { IronswornActor } from '../actor/actor'
import type { IronswornItem } from '../item/item'
import { $ActorKey } from './provisions'
import { Constructor, VueAppMixin } from './vueapp.js'

export abstract class VueActorSheet extends VueAppMixin<
	Constructor<ActorSheet<IronswornActor>>
>(ActorSheet) {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['ironsworn', 'actor']
		})
	}

	setupVueApp(app: App) {
		app.provide($ActorKey, this.actor)
	}

	override getData(...args) {
		return {
			...super.getData(...args),
			actor: this.actor.toObject()
		}
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

	protected async _onDrop(event: DragEvent) {
		const data = (TextEditor as any).getDragEventData(event)

		if (data.type === 'AssetBrowserData') {
			const document = (await fromUuid(data.uuid)) as IronswornItem | undefined

			if (document != null) {
				await this.actor.createEmbeddedDocuments('Item', [document.toObject()])
			}
		}

		super._onDrop(event)
	}
}
