import type { ChallengeRank } from '../constants'
import type { IronswornActor } from './actor'

interface CharacterSystemSource {
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

/// /////////////////////////////////////

interface SharedSystemSource {
	biography: string
	supply: number
}

/// /////////////////////////////////////

type FoeSystemSource = object

/// /////////////////////////////////////

/**
 * Represents an entry in the delve site denizen matrix.
 */
export interface DelveSiteDenizen
	extends Omit<foundry.documents.TableResultSource, 'flags'> {
	range: [number, number]
	flags: {
		'foundry-ironsworn': {
			type: 'delve-site-denizen'
			/**
			 * The ID of the originating Actor.
			 */
			sourceId: IronswornActor['id']
		}
	}
}

interface DelveSiteSystemSource {
	objective: string
	description: string
	notes: string
	rank: ChallengeRank
	current: number
	denizens: DelveSiteDenizen[]
}

/// /////////////////////////////////////

interface StarshipSystemSource {
	health: number
	debility: {
		battered: boolean
		cursed: boolean
	}
}

/// /////////////////////////////////////

interface LocationSystemSource {
	subtype: string
	klass: string
	description: string
}

/// //////////////////////////////////

export interface ActorSystemMap {
	character: CharacterSystemSource
	shared: SharedSystemSource
	foe: FoeSystemSource
	site: DelveSiteSystemSource
	starship: StarshipSystemSource
	location: LocationSystemSource
}
export type ActorSourceMap = {
	[K in keyof ActorSystemMap]: foundry.documents.ActorSource<
		K,
		ActorSystemMap[K]
	>
}

export interface IronswornActorData<T extends ActorType> {
	_source: ActorSourceMap[T] & foundry.documents.ActorSource
}

declare global {
	type ActorType = keyof ActorSystemMap

	type ActorTypeMap = {
		[K in keyof ActorSystemMap]: IronswornActor<K>
	}
	type IronswornActorSource<T extends ActorType = ActorType> = ActorSourceMap[T]
}
