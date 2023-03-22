import type { ChallengeRank } from '../constants'
import { IronswornActor } from './actor'

interface CharacterSystem {
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

export interface CharacterDataPropertiesData extends CharacterSystem {
	momentumMax: number
	momentumReset: number
}

export interface CharacterDataProperties {
	type: 'character'
	system: CharacterDataPropertiesData
}

export interface IronswornCharacter {
	type: 'character'
	system: CharacterSystem
}

/// /////////////////////////////////////

export interface IronswornShared {
	type: 'shared'
	system: {
		biography: string
		supply: number
	}
}

/// /////////////////////////////////////

export interface IronswornFoe {
	type: 'foe'
	system: Record<string, unknown>
}

/// /////////////////////////////////////

/**
 * Represents an entry in the delve site denizen matrix.
 */
export interface DelveSiteDenizen extends TableResult {
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

export interface IronswornDelveSite {
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

/// /////////////////////////////////////

export interface IronswornStarship {
	type: 'starship'
	system: {
		health: number
		debility: {
			battered: boolean
			cursed: boolean
		}
	}
}

/// /////////////////////////////////////

export interface IronswornLocation {
	type: 'location'
	system: {
		subtype: string
		klass: string
		description: string
	}
}

/// /////////////////////////////////////

declare global {
	// These are kept separate so they can be readily referenced without excessive recursion
	interface ActorSystemMap {
		character: IronswornCharacter
		shared: IronswornShared
		foe: IronswornFoe
		site: IronswornDelveSite
		starship: IronswornStarship
		location: IronswornLocation
	}
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	type ActorTypeMap = {
		[K in keyof ActorSystemMap]?: ActorSystemMap[K] & IronswornActor
	}
	type ActorType = keyof ActorSystemMap
}
