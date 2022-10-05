import type {
  ActorDataBaseProperties,
  ActorDataBaseSource,
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData.js'

interface CharacterDataSourceData {
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

interface CharacterDataPropertiesData extends CharacterDataSourceData {
  momentumMax: number
  momentumReset: number
}

export interface CharacterDataProperties extends ActorDataBaseProperties {
  type: 'character'
  data: CharacterDataPropertiesData
}

export interface CharacterDataSource {
  type: 'character'
  data: CharacterDataSourceData
}

////////////////////////////////////////

interface SharedDataSourceData {
  biography: string
  supply: number
}
type SharedDataPropertiesData = SharedDataSourceData

interface SharedDataSource extends ActorDataBaseSource {
  type: 'shared'
  data: SharedDataSourceData
}
export interface SharedDataProperties extends ActorDataBaseProperties {
  type: 'shared'
  data: SharedDataPropertiesData
}

////////////////////////////////////////

interface FoeDataSourceData {}
type FoeDataPropertiesData = FoeDataSourceData

interface FoeDataSource extends ActorDataBaseSource {
  type: 'foe'
  data: FoeDataSourceData
}
export interface FoeDataProperties extends ActorDataBaseProperties {
  type: 'foe'
  data: FoeDataPropertiesData
}

////////////////////////////////////////

export interface DenizenSlot {
  low: number
  high: number
  descriptor: string
  description: string
}

interface SiteDataSourceData {
  objective: string
  description: string
  notes: string
  rank: string
  current: number
  denizens: DenizenSlot[]
}
type SiteDataPropertiesData = SiteDataSourceData

export interface SiteDataSource extends ActorDataBaseSource {
  type: 'site'
  data: SiteDataSourceData
}
export interface SiteDataProperties extends ActorDataBaseProperties {
  type: 'site'
  data: SiteDataPropertiesData
}

////////////////////////////////////////

interface StarshipDataSourceData {
  health: number
  debility: {
    battered: boolean
    cursed: boolean
  }
}
type StarshipDataPropertiesData = StarshipDataSourceData

export interface StarshipDataSource extends ActorDataBaseSource {
  type: 'starship'
  data: StarshipDataSourceData
}
export interface StarshipDataProperties extends ActorDataBaseProperties {
  type: 'starship'
  data: StarshipDataPropertiesData
}

////////////////////////////////////////

interface LocationDataSourceData {
  subtype: string
  klass: string
  description: string
}
type LocationDataPropertiesData = LocationDataSourceData

export interface LocationDataSource extends ActorDataBaseSource {
  type: 'location'
  data: LocationDataSourceData
}
export interface LocationDataProperties extends ActorDataBaseProperties {
  type: 'location'
  data: LocationDataPropertiesData
}

////////////////////////////////////////

export type ActorDataSource =
  | CharacterDataSource
  | SharedDataSource
  | FoeDataSource
  | SiteDataSource
  | StarshipDataSource
  | LocationDataSource
export type ActorDataProperties =
  | CharacterDataProperties
  | SharedDataProperties
  | FoeDataProperties
  | SiteDataProperties
  | StarshipDataProperties
  | LocationDataProperties

declare global {
  interface SourceConfig {
    Actor: ActorDataSource
  }

  interface DataConfig {
    Actor: ActorDataProperties
  }
}
