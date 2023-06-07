import type { DebilityCategoryClassic, ImpactCategoryStarforged } from './types'

export interface ImpactFlags {
	/**
	 * Some impacts, like Wounded, prevent recovery of a certain player resource. Include an actor path to the resource in question (e.g. `system.health`) if this is desired.
	 */
	preventRecovery?: string
	global?: boolean
	globalHint?: boolean
	/**
	 * A value for the `foundry-ironsworn.category` flag.
	 */
	category?: DebilityCategoryClassic | ImpactCategoryStarforged
	type?: 'impact'
}

export type ActiveEffectFlags = ImpactFlags

declare global {
	interface FlagConfig {
		ActiveEffect: {
			'foundry-ironsworn': ActiveEffectFlags
		}
	}
}

export {}
