import type { IMove, RequireKey } from 'dataforged'
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

export interface IronswornAssetBase {
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

export type IronswornAssetSource = foundry.data.ItemSource & IronswornAssetBase

/// ////////////////////////////

export type ProgressItemSubtype = 'vow' | 'bond' | 'progress' | 'foe'

interface ProgressSystem extends ProgressBase {
	subtype: ProgressItemSubtype
	starred: boolean
	hasTrack: boolean
	hasClock: boolean
	clockTicks: number
	clockMax: number
}

export interface IronswornProgressBase {
	type: 'progress'
	system: ProgressSystem
}

export type IronswornProgressSource = foundry.data.ItemSource &
	IronswornProgressBase

/// ////////////////////////////

interface Bond {
	name: string
	notes: string
}

export interface IronswornBondsetBase {
	type: 'bondset'
	system: {
		bonds: Bond[]
	}
}

export type IronswornBondsetSource = foundry.data.ItemSource &
	IronswornBondsetBase

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
> extends PreCreate<foundry.data.TableResultSource> {
	range: [number, number]
	text: string
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

export interface IronswornDelveThemeBase {
	type: 'delve-theme'
	system: {
		summary: string
		description: string
		features: DelveSiteFeature[]
		dangers: DelveSiteDanger[]
	}
}

export type IronswornDelveThemeSource = foundry.data.ItemSource &
	IronswornDelveThemeBase
/// ////////////////////////////

export interface IronswornDelveDomainBase {
	type: 'delve-domain'
	system: {
		summary: string
		description: string
		features: DelveSiteFeature[]
		dangers: DelveSiteDanger[]
	}
}

export type IronswornDelveDomainSource = foundry.data.ItemSource &
	IronswornDelveDomainBase

/// ////////////////////////////
interface MoveSystem extends IMove {
	dfid: string
}

export interface IronswornMoveBase {
	type: 'sfmove'
	system: MoveSystem
}

export type IronswornMoveSource = foundry.data.ItemSource & IronswornMoveBase

/// ////////////////////////////

declare global {
	type ItemType = keyof ItemBaseMap

	interface ItemBaseMap {
		asset: IronswornAssetBase
		progress: IronswornProgressBase
		bondset: IronswornBondsetBase
		sfmove: IronswornMoveBase
		'delve-theme': IronswornDelveThemeBase
		'delve-domain': IronswornDelveDomainBase
	}
	interface ItemSourceMap
		extends Record<keyof ItemBaseMap, foundry.data.ItemSource> {
		asset: IronswornAssetSource
		progress: IronswornProgressSource
		bondset: IronswornBondsetSource
		sfmove: IronswornMoveSource
		'delve-theme': IronswornDelveThemeSource
		'delve-domain': IronswornDelveDomainSource
	}
	type ItemTypeMap = {
		[K in keyof ItemBaseMap]: IronswornItem<K>
	}
	interface IronswornItemData<T extends ItemType>
		extends foundry.abstract.DocumentData {
		_source: ItemSourceMap[T]
	}
	type IronswornItemSource<T extends ItemType = ItemType> = ItemSourceMap[T]
}
