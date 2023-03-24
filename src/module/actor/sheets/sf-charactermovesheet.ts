import CharacterMoveSheet from '../../vue/sf-charactermovesheet.vue'
import type { IronswornActor } from '../actor'
import type { App } from 'vue'
import { $ActorKey } from '../../vue/provisions'
import type { VueApplicationOptions } from '../../vue/vueapp.js'
import { VueAppMixin } from '../../vue/vueapp.js'
import { MoveSheetTour } from '../../features/tours/move-sheet-tour'

export class SFCharacterMoveSheet extends VueAppMixin(Application) {
	constructor(
		protected actor: IronswornActor<'character'>,
		protected toolset: 'ironsworn' | 'starforged' = 'starforged',
		options?: Partial<VueApplicationOptions>
	) {
		super(options)
	}

	async getData(options?: Partial<VueApplicationOptions> | undefined) {
		const data = await super.getData(options)
		return {
			...data,
			toolset: this.toolset,
			actor: this.actor.toObject()
		} as any
	}

	setupVueApp(app: App<any>): void {
		app.provide($ActorKey, this.actor)
	}

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			resizable: true,
			width: 350,
			height: 820,
			left: 685,
			rootComponent: CharacterMoveSheet
		}) as any
	}

	get title() {
		return `${game.i18n.localize('IRONSWORN.ITEMS.TypeMove')} — ${
			this.actor.name
		}`
	}

	activateTab(tabKey: string) {
		this.localEmitter.emit('activateTab', tabKey)
	}

	protected _getHeaderButtons(): ApplicationHeaderButton[] {
		return [
			{
				class: 'ironsworn-help',
				icon: 'fa fa-circle-question',
				label: '',
				// eslint-disable-next-line @typescript-eslint/no-misused-promises
				onclick: async () => {
					const tour = new MoveSheetTour(this)
					await tour.reset()
					await tour.start()
				}
			},
			...super._getHeaderButtons()
		]
	}
}

// When changing actor sheets, make sure we don't get a stale move sheet
Hooks.on('preUpdateActor', (actor, data) => {
	if (actor.type === 'character' && (data.flags as any)?.core?.sheetClass) {
		;(actor as IronswornActor).moveSheet = undefined
	}
})
Hooks.on('preUpdateSetting', (setting, _) => {
	if (setting.key === 'core.sheetClasses') {
		for (const actor of game.actors ?? []) {
			actor.moveSheet = undefined
		}
	}
})
