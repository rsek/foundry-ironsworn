import type { IMove } from 'dataforged'
import type { ChallengeRank } from '../constants'
import type { IronswornItem } from './item'

interface ProgressBase {
	description: string
	rank: ChallengeRank
	current: number
	completed: boolean
}

/// ////////////////////////////

export interface AssetField {
	name: string
	value: string
}

export interface AssetAbility {
	name?: string
	enabled: boolean
	description: string
	hasClock: boolean
	clockMax: number
	clockTicks: number
}

interface AssetExclusiveOption {
	name: string
	selected: boolean
}

interface AssetCondition {
	name: string
	ticked: boolean
}

export interface IronswornAsset {
	type: 'asset'
	system: {
		category: string
		description?: string
		requirement: string
		color: string
		fields: AssetField[]
		abilities: AssetAbility[]
		track: {
			enabled: boolean
			name: string
			current: number
			max: number
		}
		exclusiveOptions: AssetExclusiveOption[]
		conditions: AssetCondition[]
	}
}

/// ////////////////////////////

interface ProgressSystem extends ProgressBase {
	subtype: string
	starred: boolean
	hasTrack: boolean
	hasClock: boolean
	clockTicks: number
	clockMax: number
}

export interface IronswornProgress {
	type: 'progress'
	system: ProgressSystem
}

/// ////////////////////////////

interface Bond {
	name: string
	notes: string
}

export interface IronswornBondset {
	type: 'bondset'
	system: {
		bonds: Bond[]
	}
}

/// ////////////////////////////

export interface LegacyFeatureOrDanger {
	low: number
	high: number
	description: string
}

export interface DelveSiteFeatureOrDanger<
	T extends 'delve-site-danger' | 'delve-site-feature' =
		| 'delve-site-danger'
		| 'delve-site-feature'
> extends ConstructorParameters<typeof TableResult> {
	flags: {
		'foundry-ironsworn': {
			/**
			 * Whether this is a site danger or a site feature.
			 */
			type: T
			/**
			 * The ID of the originating Item.
			 */
			sourceId: Item['id']
		}
	}
}

export interface DelveSiteFeature
	extends DelveSiteFeatureOrDanger<'delve-site-feature'> {}

export interface DelveSiteDanger
	extends DelveSiteFeatureOrDanger<'delve-site-danger'> {}

export interface IronswornDelveTheme {
	type: 'delve-theme'
	system: {
		summary: string
		description: string
		features: DelveSiteFeature[]
		dangers: DelveSiteDanger[]
	}
}
/// ////////////////////////////

export interface IronswornDelveDomain {
	type: 'delve-domain'
	system: {
		summary: string
		description: string
		features: DelveSiteFeature[]
		dangers: DelveSiteDanger[]
	}
}

/// ////////////////////////////

export interface MoveSystem extends IMove {
	dfid: string
}

export interface IronswornMove {
	type: 'sfmove'
	system: MoveSystem
}

/// ////////////////////////////

declare global {
	interface ItemSystemMap {
		asset: IronswornAsset
		progress: IronswornProgress
		bondset: IronswornBondset
		sfmove: IronswornMove
		'delve-theme': IronswornDelveTheme
		'delve-domain': IronswornDelveDomain
	}
	type ItemTypeMap = {
		[K in keyof ItemSystemMap]?: ItemSystemMap[K] & IronswornItem
	}
	type ItemType = keyof ItemSystemMap
}
