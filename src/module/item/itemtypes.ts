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

interface AssetSystemSource {
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

/// ////////////////////////////

export type ProgressItemSubtype = 'vow' | 'bond' | 'progress' | 'foe'

interface ProgressSystemSource extends ProgressBase {
	subtype: ProgressItemSubtype
	starred: boolean
	hasTrack: boolean
	hasClock: boolean
	clockTicks: number
	clockMax: number
}

/// ////////////////////////////

interface Bond {
	name: string
	notes: string
}

interface BondsetSystemSource {
	bonds: Bond[]
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
> extends PreCreate<foundry.documents.TableResultSource> {
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
			sourceId: IronswornItem<'delve-domain' | 'delve-theme'>['id']
		}
	}
}

export interface DelveSiteFeature
	extends DelveSiteFeatureOrDanger<'delve-site-feature'> {}

export interface DelveSiteDanger
	extends DelveSiteFeatureOrDanger<'delve-site-danger'> {}

interface DelveThemeSystemSource {
	summary: string
	description: string
	features: DelveSiteFeature[]
	dangers: DelveSiteDanger[]
}

/// ////////////////////////////

interface DelveDomainSystemSource {
	summary: string
	description: string
	features: DelveSiteFeature[]
	dangers: DelveSiteDanger[]
}

/// ////////////////////////////
interface MoveSystemSource extends IMove {
	dfid: string
}

/// ////////////////////////////

export interface ItemSystemMap {
	asset: AssetSystemSource
	progress: ProgressSystemSource
	bondset: BondsetSystemSource
	sfmove: MoveSystemSource
	'delve-theme': DelveThemeSystemSource
	'delve-domain': DelveDomainSystemSource
}
export type ItemSourceMap = {
	[K in keyof ItemSystemMap]: foundry.documents.ItemSource<K, ItemSystemMap[K]>
}

export interface IronswornItemData<T extends ItemType> {
	_source: ItemSourceMap[T] & foundry.documents.ItemSource
}

declare global {
	type ItemType = keyof ItemSystemMap

	type ItemTypeMap = {
		[K in keyof ItemSystemMap]: IronswornItem<K>
	}
	type IronswornItemSource<T extends ItemType = ItemType> = ItemSourceMap[T]
}
