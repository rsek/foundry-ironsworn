import type { EffectChangeDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/effectChangeData'
import type { PartialBy } from 'dataforged'
import { IronswornSettings } from '../helpers/settings'
import type { ActiveEffectDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/activeEffectData'
import type {
	ConfiguredDocumentClass,
	DocumentSubTypes
} from '../../types/helperTypes'
import { sendToChat } from '../features/chat-alert'
import type { ImpactOptions } from './types'
import type { ImpactFlags } from './config'

type Ruleset = 'starforged' | 'classic'

export class IronActiveEffect extends ActiveEffect {
	static readonly MOMENTUM_RESET_PATH = 'system.momentum.resetValue'
	static readonly MOMENTUM_MAX_PATH = 'system.momentum.max'
	static readonly PRESETS: Record<
		Required<ImpactFlags>['type'],
		EffectChangeDataConstructorData[]
	> = {
		impact: [
			{
				key: this.MOMENTUM_MAX_PATH,
				mode: CONST.ACTIVE_EFFECT_MODES.ADD,
				value: '-1'
			},
			{
				key: this.MOMENTUM_RESET_PATH,
				mode: CONST.ACTIVE_EFFECT_MODES.ADD,
				value: '-1'
			}
		]
	}

	get isCustomImpact() {
		return this.getFlag('foundry-ironsworn', 'isCustomImpact') ?? false
	}

	get type() {
		return this.getFlag('foundry-ironsworn', 'type')
	}

	get impactSubtype() {
		if (this.type !== 'impact') return null
		switch (this.getFlag('foundry-ironsworn', 'ruleset')) {
			case 'starforged':
				return 'impact'
			case 'classic':
				return 'debility'
			default:
				return this.parent?.impactType ?? null
		}
	}

	/** All canonical status effects, organized by ruleset */
	static get statusEffects() {
		return {
			starforged: [
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'wounded',
					ruleset: 'starforged',
					name: game.i18n.localize('IRONSWORN.IMPACT.Wounded'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/wounded.svg',
					noRecover: 'system.health',
					category: 'misfortunes'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'shaken',
					ruleset: 'starforged',
					name: game.i18n.localize('IRONSWORN.IMPACT.Shaken'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/shaken.svg',
					noRecover: 'system.spirit',
					category: 'misfortunes'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'unprepared',
					ruleset: 'starforged',
					name: game.i18n.localize('IRONSWORN.IMPACT.Unprepared'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/unprepared.svg',
					noRecover: 'system.supply',
					category: 'misfortunes',
					global: true
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'permanently_harmed',
					ruleset: 'starforged',
					name: game.i18n.localize('IRONSWORN.IMPACT.PermanentlyHarmed'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/permanently_harmed.svg',
					category: 'lastingEffects'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'traumatized',
					ruleset: 'starforged',
					name: game.i18n.localize('IRONSWORN.IMPACT.Traumatized'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/traumatized.svg',
					category: 'lastingEffects'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'tormented',
					ruleset: 'starforged',
					name: game.i18n.localize('IRONSWORN.IMPACT.Tormented'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/tormented.svg',
					category: 'burdens'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'doomed',
					ruleset: 'starforged',
					name: game.i18n.localize('IRONSWORN.IMPACT.Doomed'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/doomed.svg',
					category: 'burdens'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'indebted',
					ruleset: 'starforged',
					name: game.i18n.localize('IRONSWORN.IMPACT.Indebted'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/indebted.svg',
					category: 'burdens'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'battered',
					ruleset: 'starforged',
					name: game.i18n.localize('IRONSWORN.IMPACT.Battered'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/battered.svg',
					globalHint: true,
					category: 'vehicle'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'cursed_starforged',
					ruleset: 'starforged',
					name: game.i18n.localize('IRONSWORN.IMPACT.Cursed'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/cursed_starforged.svg',
					globalHint: true,
					category: 'vehicle'
				})
			],
			classic: [
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'wounded',
					ruleset: 'classic',
					name: game.i18n.localize('IRONSWORN.DEBILITY.Wounded'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/wounded.svg',
					noRecover: 'system.health',
					category: 'conditions'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'unprepared',
					ruleset: 'classic',
					name: game.i18n.localize('IRONSWORN.DEBILITY.Unprepared'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/unprepared.svg',
					noRecover: 'system.supply',
					global: true,
					category: 'conditions'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'shaken',
					ruleset: 'classic',
					name: game.i18n.localize('IRONSWORN.DEBILITY.Shaken'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/shaken.svg',
					noRecover: 'system.spirit',
					category: 'conditions'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'encumbered',
					ruleset: 'classic',
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/encumbered.svg',
					name: game.i18n.localize('IRONSWORN.DEBILITY.Encumbered'),
					category: 'conditions'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'maimed',
					ruleset: 'classic',
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/permanently_harmed.svg',
					name: game.i18n.localize('IRONSWORN.DEBILITY.Maimed'),
					category: 'banes'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'corrupted',
					ruleset: 'classic',
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/corrupted.svg',
					name: game.i18n.localize('IRONSWORN.DEBILITY.Corrupted'),
					category: 'banes'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'cursed',
					ruleset: 'classic',
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/doomed.svg',
					name: game.i18n.localize('IRONSWORN.DEBILITY.Cursed'),
					category: 'burdens'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'tormented',
					ruleset: 'classic',
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/tormented.svg',
					name: game.i18n.localize('IRONSWORN.DEBILITY.Tormented'),
					category: 'burdens'
				})
			]
		}
	}

	async toMessage(active: boolean) {
		const gameIsStarforged = IronswornSettings.starforgedToolsEnabled
		const params = gameIsStarforged
			? { impact: game.i18n.localize(this.name) }
			: { debility: game.i18n.localize(this.name) }
		const i18nKey = active
			? CONFIG.IRONSWORN.IronActiveEffect.impactMarkedKey
			: CONFIG.IRONSWORN.IronActiveEffect.impactClearedKey
		const msg = game.i18n.format(i18nKey, params)
		const ActorClass = getDocumentClass('Actor')
		const speaker = this.parent
		if (!(speaker instanceof ActorClass)) return
		return await sendToChat(speaker, msg)
	}

	/**
	 * Makes active effect changes obey a numeric field's `min` and `max` properties.
	 * @remarks Mutates `changes`
	 */
	static #clampChangesToField(
		actor: InstanceType<
			ConfiguredDocumentClass<typeof foundry.documents.BaseActor>
		>,
		changes: object,
		attr: string
	) {
		const value = changes[attr]

		if (typeof value !== 'number') return changes
		const [head, ...tail] = attr.split('.')
		if (head !== 'system') return changes

		const field = actor.system.schema.getField(tail)

		// const systemAttr =

		if (!(field instanceof foundry.data.fields.NumberField)) return changes
		const { min, max } = field
		let newValue: number
		if (typeof min === 'number' && typeof max === 'number')
			newValue = Math.clamped(value, min, max)
		else if (typeof min === 'number') newValue = Math.max(value, min)
		else if (typeof max === 'number') newValue = Math.max(value, max)
		else return changes

		changes[attr] = newValue

		return changes
	}

	/**
	 * @remarks AEs don't respect field minimums/maximums out of the box, so we do some DIY for the attributes where it matters.
	 * @see https://github.com/foundryvtt/foundryvtt/issues/9468
	 */
	override apply(actor, change) {
		let changes = super.apply(actor, change) as object

		let updated = false

		// this is intentionally limited in scope for now, but this could probably be applied to other attributes
		for (const attr of [
			IronActiveEffect.MOMENTUM_RESET_PATH,
			IronActiveEffect.MOMENTUM_MAX_PATH
		]) {
			if (attr in changes) {
				changes = IronActiveEffect.#clampChangesToField(actor, changes, attr)
				updated = true
			}
		}

		if (updated) foundry.utils.mergeObject(actor, changes)

		return changes
	}

	override _onCreate(data, options, userId) {
		super._onCreate(data, options, userId)

		switch (this.getFlag('foundry-ironsworn', 'type')) {
			case 'impact':
				if (
					hasProperty(data, 'flags.foundry-ironsworn.isCustomImpact') &&
					typeof data._id === 'string'
				)
					this.updateSource({
						statuses: [data._id]
					} as any)
				if (this.modifiesActor && IronswornSettings.get('log-changes'))
					void this.toMessage(true)

				break

			default:
				break
		}
	}

	override _onUpdate(data, options, userId) {
		super._onUpdate(data, options, userId)
		switch (this.getFlag('foundry-ironsworn', 'type')) {
			case 'impact':
				{
					if (!(this.target instanceof Actor)) return
					const activeChanged = 'disabled' in data
					if (activeChanged && IronswornSettings.get('log-changes'))
						void this.toMessage(this.active)
				}
				break
			default:
				break
		}
	}

	override _onDelete(options, userId) {
		super._onDelete(options, userId)
		switch (this.getFlag('foundry-ironsworn', 'type')) {
			case 'impact':
				if (this.modifiesActor && IronswornSettings.get('log-changes'))
					void this.toMessage(false)
				break
			default:
				break
		}
	}

	static get impactMarkedKey() {
		const gameIsStarforged = IronswornSettings.starforgedToolsEnabled
		return gameIsStarforged
			? `IRONSWORN.ChatAlert.MarkedImpact`
			: 'IRONSWORN.ChatAlert.MarkedDebility'
	}

	static get impactClearedKey() {
		const gameIsStarforged = IronswornSettings.starforgedToolsEnabled
		return gameIsStarforged
			? `IRONSWORN.ChatAlert.ClearedImpact`
			: 'IRONSWORN.ChatAlert.ClearedDebility'
	}

	static get customLabelFallback() {
		return IronswornSettings.starforgedToolsEnabled
			? game.i18n.localize('IRONSWORN.IMPACT.Custom')
			: game.i18n.localize('IRONSWORN.DEBILITY.Custom')
	}

	static IMPACT_ICON_DEFAULT = 'icons/svg/downgrade.svg'

	/**
	 * Sets an active effect across all actors of the provided types.
	 * @param statusEffect Data for the status effect to be applied
	 * @param active Should the effect be set to active? If false, the effect will instead be disabled.
	 * @param actorTypes The types of actor for this effect to be applied to. (default: `['character', 'starship']`)
	 */
	static async setGlobal(
		statusEffect: StatusEffectV11,
		active: boolean,
		actorTypes: Array<DocumentSubTypes<'Actor'>> = ['character', 'starship']
	) {
		const actorsToUpdate =
			game.actors?.contents.filter((x) => actorTypes.includes(x.type)) ?? []

		for await (const actor of actorsToUpdate) {
			await actor.toggleActiveEffect(statusEffect, { active })
		}
	}

	static statusToActiveEffectData(effectData: StatusEffectV11) {
		const createData = foundry.utils.deepClone(effectData) as PartialBy<
			typeof effectData,
			'id'
		>
		createData.name = game.i18n.localize(effectData.name)
		;(createData as any).statuses = []
		delete createData.id
		return createData as ActiveEffectDataConstructorData & { name: string }
	}

	/**
	 * Create constructor data for an ActiveEffect that represents an impact.
	 */
	static createImpact({
		id,
		name,
		icon,
		noRecover,
		global,
		globalHint,
		category,
		disabled
	}: ImpactOptions) {
		if (icon == null) icon = this.IMPACT_ICON_DEFAULT
		const result: StatusEffectV11 = {
			id,
			disabled,
			name,
			statuses: id != null ? [id] : [],
			icon: icon ?? this.IMPACT_ICON_DEFAULT,
			changes: foundry.utils.deepClone(this.PRESETS.impact) as any,
			flags: {
				'foundry-ironsworn': {
					type: 'impact',
					noRecover,
					globalHint,
					global,
					category
				}
			}
		}

		if (result.name == null || result.name.length === 0)
			result.name = this.customLabelFallback

		if (noRecover != null)
			result.changes?.push(
				{
					key: `${noRecover}.value`,
					mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
					value: '0',
					priority: 10
				},
				{
					key: `${noRecover}.noRecover`,
					mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
					value: 'true',
					priority: 10
				}
			)
		return result
	}

	static async createCustomImpact(context: DocumentModificationContext = {}) {
		const data: ActiveEffectDataConstructorData = {
			...this.statusToActiveEffectData(
				this.createImpact({
					id: null as any,
					name: game.i18n.localize(`IRONSWORN.IMPACT.Custom`),
					icon: this.IMPACT_ICON_DEFAULT
				})
			),
			disabled: true
		}
		setProperty(data, 'flags.foundry-ironsworn.isCustomImpact', true)

		return await this.create(data, context)
	}
}

export interface IronActiveEffect {
	statuses: Set<string>
	parent: InstanceType<
		ConfiguredDocumentClass<typeof foundry.documents.BaseActor>
	> | null
	get name(): string
	/**
	 * Provide forward-compatibility with other Document types which use img as their primary image or icon.
	 * We are likely to formally migrate this in the future, but for now this getter provides compatible read access.
	 */
	get img(): string
	/**
	 * Retrieve the Document that this ActiveEffect targets for modification.
	 */
	get target(): InstanceType<
		ConfiguredDocumentClass<typeof foundry.documents.BaseActor>
	> | null
	/**
	 * Whether the Active Effect currently applying its changes to the target.
	 */
	get active(): boolean
	/**
	 * Does this Active Effect currently modify an Actor?
	 */
	get modifiesActor(): boolean
}

/**
 * Disable the button if no impacts are available for the actor, and set title attributes to title case.
 */
Hooks.on(
	'renderTokenHUD',
	async (
		app: TokenHUD,
		html: JQuery<HTMLFormElement>,
		_data: TokenHUD.RenderOptions
	) => {
		const token = app.object?.document
		const actor = app.object?.actor

		// fall back to default rendering if the required data is missing
		if (token == null || actor == null || actor.validImpacts == null) return

		const iconSize = 36
		const hudLabelKey = `IRONSWORN.HUD.Mark${
			actor.impactType === 'debility' ? 'Debilities' : 'Impacts'
		}`

		const statusEffectToggle = html
			.find<HTMLImageElement>('[data-action="effects"]')
			.first()
		const toggleIcon = statusEffectToggle.find<HTMLImageElement>('img').first()

		toggleIcon
			.attr('title', game.i18n.localize(hudLabelKey))
			.attr('src', IronActiveEffect.IMPACT_ICON_DEFAULT)
		if (actor.validImpacts.length === 0)
			statusEffectToggle.attr('aria-disabled', 'true')

		html
			.find<HTMLImageElement>('.status-effects .effect-control')
			.each((_, el) => {
				el.title = el.title.capitalize()
				el.height = iconSize
				el.width = iconSize
			})
	}
)
