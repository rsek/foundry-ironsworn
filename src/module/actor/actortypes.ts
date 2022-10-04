export enum ActorType {
  Character = 'character',
  Site = 'site',
  Shared = 'shared',
  Foe = 'foe',
  Starship = 'starship',
  Location = 'location',
}

interface IronswornActorDataBase {
  type: ActorType
}

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

export interface CharacterDataProperties extends IronswornActorDataBase {
  type: ActorType.Character
  data: CharacterDataPropertiesData
}

export interface CharacterDataSource extends IronswornActorDataBase {
  type: ActorType.Character
  data: CharacterDataSourceData
}

////////////////////////////////////////

interface SharedDataSourceData {
  biography: string
  supply: number
}
type SharedDataPropertiesData = SharedDataSourceData

export interface SharedDataSource extends IronswornActorDataBase {
  type: ActorType.Shared
  data: SharedDataSourceData
}
export interface SharedDataProperties extends IronswornActorDataBase {
  type: ActorType.Shared
  data: SharedDataPropertiesData
}

////////////////////////////////////////

interface FoeDataSourceData {}
type FoeDataPropertiesData = FoeDataSourceData

export interface FoeDataSource extends IronswornActorDataBase {
  type: ActorType.Foe
  data: FoeDataSourceData
}
export interface FoeDataProperties extends IronswornActorDataBase {
  type: ActorType.Foe
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

export interface SiteDataSource extends IronswornActorDataBase {
  type: ActorType.Site
  data: SiteDataSourceData
}
export interface SiteDataProperties extends IronswornActorDataBase {
  type: ActorType.Site
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

export interface StarshipDataSource extends IronswornActorDataBase {
  type: ActorType.Starship
  data: StarshipDataSourceData
}
export interface StarshipDataProperties extends IronswornActorDataBase {
  type: ActorType.Starship
  data: StarshipDataPropertiesData
}

////////////////////////////////////////

interface LocationDataSourceData {
  subtype: string
  klass: string
  description: string
}
type LocationDataPropertiesData = LocationDataSourceData

export interface LocationDataSource extends IronswornActorDataBase {
  type: ActorType.Location
  data: LocationDataSourceData
}
export interface LocationDataProperties extends IronswornActorDataBase {
  type: ActorType.Location
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
