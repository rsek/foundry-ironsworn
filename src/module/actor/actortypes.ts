import type { ChallengeRank } from '../constants'
import type { IronswornActor } from './actor'

interface IronswornCharacterSourceSystem {
	biography: string
	notes: string
	edge: number
	heart: number
	iron: number
	shadow: number
	wits: number
	health: number
	spirit: number
	supply: number
	experience: number
	momentum: number
	momentumReset: number
	momentumMax: number
	debility: {
		corrupted: boolean
		cursed: boolean
		encumbered: boolean
		maimed: boolean
		shaken: boolean
		tormented: boolean
		unprepared: boolean
		wounded: boolean
		permanentlyharmed: boolean
		traumatized: boolean
		doomed: boolean
		indebted: boolean
		battered: boolean
		custom1: boolean
		custom1name: string
		custom2: boolean
		custom2name: string
	}
	legacies: {
		quests: number
		questsXpSpent: number
		bonds: number
		bondsXpSpent: number
		discoveries: number
		discoveriesXpSpent: number
	}
	xp: number
}

export interface IronswornCharacterBase {
	type: 'character'
	system: IronswornCharacterSourceSystem
}

export type IronswornCharacterSource = foundry.data.ActorSource &
	IronswornCharacterBase

/// /////////////////////////////////////

export interface IronswornSharedBase {
	type: 'shared'
	system: {
		biography: string
		supply: number
	}
}

export type IronswornSharedSource = foundry.data.ActorSource &
	IronswornSharedBase

/// /////////////////////////////////////

export interface IronswornFoeBase {
	type: 'foe'
	system: Record<string, unknown>
}
export type IronswornFoeSource = foundry.data.ActorSource & IronswornFoeBase

/// /////////////////////////////////////

/**
 * Represents an entry in the delve site denizen matrix.
 */
export interface DelveSiteDenizen extends Omit<TableResult, 'flags'> {
	range: [number, number]
	flags: {
		'foundry-ironsworn': {
			type: 'delve-site-denizen'
			/**
			 * The ID of the originating Actor.
			 */
			sourceId: Actor['id']
		}
	}
}

export interface IronswornDelveSiteBase {
	type: 'site'
	system: {
		objective: string
		description: string
		notes: string
		rank: ChallengeRank
		current: number
		denizens: DelveSiteDenizen[]
	}
}

export type IronswornDelveSiteSource = foundry.data.ActorSource &
	IronswornDelveSiteBase

/// /////////////////////////////////////

export interface IronswornStarshipBase {
	type: 'starship'
	system: {
		health: number
		debility: {
			battered: boolean
			cursed: boolean
		}
	}
}

export type IronswornStarshipSource = foundry.data.ActorSource &
	IronswornStarshipBase

/// /////////////////////////////////////

export interface IronswornLocationBase {
	type: 'location'
	system: {
		subtype: string
		klass: string
		description: string
	}
}

export type IronswornLocationSource = foundry.data.ActorSource &
	IronswornLocationBase

/// //////////////////////////////////

declare global {
	type ActorType = keyof ActorBaseMap

	// These are kept separate so they can be readily referenced without excessive recursion
	interface ActorBaseMap {
		character: IronswornCharacterBase
		shared: IronswornSharedBase
		foe: IronswornFoeBase
		site: IronswornDelveSiteBase
		starship: IronswornStarshipBase
		location: IronswornLocationBase
	}
	interface ActorSourceMap
		extends Record<keyof ActorBaseMap, foundry.data.ActorSource> {
		character: IronswornCharacterSource
		shared: IronswornSharedSource
		foe: IronswornFoeSource
		site: IronswornDelveSiteSource
		starship: IronswornStarshipSource
		location: IronswornLocationSource
	}
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	type ActorTypeMap = {
		[K in keyof ActorBaseMap]: IronswornActor<K>
	}

	interface IronswornActorData<T extends ActorType>
		extends foundry.abstract.DocumentData {
		_source: ActorSourceMap[T]
	}

	type IronswornActorSource<T extends ActorType = ActorType> = ActorSourceMap[T]
}
