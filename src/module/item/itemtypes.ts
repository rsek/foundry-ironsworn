import { IMove } from 'dataforged'
import { RANKS } from '../constants'

export enum ItemType {
  Asset = 'asset',
  Progress = 'progress',
  Vow = 'vow',
  Bondset = 'bondset',
  Move = 'move',
  SfMove = 'sfmove',
  DelveTheme = 'delve-theme',
  DelveDomain = 'delve-domain',
}

interface ProgressBase {
  description: string
  rank: keyof typeof RANKS
  current: number
  completed: boolean
}

///////////////////////////////

interface AssetField {
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

interface AssetDataSourceData {
  category: string
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
}

export interface AssetDataPropertiesData extends AssetDataSourceData {}

export interface AssetDataSource {
  type: ItemType.Asset
  data: AssetDataSourceData
}

export interface AssetDataProperties {
  type: ItemType.Asset
  data: AssetDataPropertiesData
}

///////////////////////////////

interface ProgressDataSourceData extends ProgressBase {
  subtype: string
  starred: boolean
  hasTrack: boolean
  hasClock: boolean
  clockTicks: number
  clockMax: number
}
interface ProgressDataPropertiesData extends ProgressDataSourceData {}

export interface ProgressDataSource {
  type: ItemType.Progress
  data: ProgressDataSourceData
}
export interface ProgressDataProperties {
  type: ItemType.Progress
  data: ProgressDataPropertiesData
}

///////////////////////////////

interface VowDataSourceData extends ProgressBase {
  description: string
  threat: string
  menace: number
}
interface VowDataPropertiesData extends VowDataSourceData {}

export interface VowDataSource {
  type: ItemType.Vow
  data: VowDataSourceData
}
export interface VowDataProperties {
  type: ItemType.Vow
  data: VowDataPropertiesData
}

///////////////////////////////

interface Bond {
  name: string
  notes: string
}

interface BondsetDataSourceData {
  bonds: Bond[]
}
export interface BondsetDataPropertiesData extends BondsetDataSourceData {}

export interface BondsetDataSource {
  type: ItemType.Bondset
  data: BondsetDataSourceData
}
export interface BondsetDataProperties {
  type: ItemType.Bondset
  data: BondsetDataPropertiesData
}

///////////////////////////////

export interface FeatureOrDanger {
  low: number
  high: number
  description: string
}

interface DelveThemeDataSourceData {
  summary: string
  description: string
  features: FeatureOrDanger[]
  dangers: FeatureOrDanger[]
}
interface DelveThemeDataPropertiesData extends DelveThemeDataSourceData {}

export interface DelveThemeDataSource {
  type: ItemType.DelveTheme
  data: DelveThemeDataSourceData
}
export interface DelveThemeDataProperties {
  type: ItemType.DelveTheme
  data: DelveThemeDataPropertiesData
}
///////////////////////////////

interface DelveDomainDataSourceData {
  summary: string
  description: string
  features: FeatureOrDanger[]
  dangers: FeatureOrDanger[]
}
interface DelveDomainDataPropertiesData extends DelveDomainDataSourceData {}

export interface DelveDomainDataSource {
  type: ItemType.DelveDomain
  data: DelveDomainDataSourceData
}
export interface DelveDomainDataProperties {
  type: ItemType.DelveDomain
  data: DelveDomainDataPropertiesData
}

///////////////////////////////

interface MoveDataSourceData {
  description: string
  fulltext: string
  strong: string
  weak: string
  miss: string
  stats: string[]
  sourceId: string
  dfid: string
}
interface MoveDataPropertiesData extends MoveDataSourceData {}

export interface MoveDataSource {
  type: ItemType.Move
  data: MoveDataSourceData
}
export interface MoveDataProperties {
  type: ItemType.Move
  data: MoveDataPropertiesData
}

///////////////////////////////

interface SFMoveDataPropertiesData extends IMove {
  dfid: string
}

export interface SFMoveDataSource {
  type: ItemType.SfMove
  data: IMove
}
export interface SFMoveDataProperties {
  data: SFMoveDataPropertiesData
  type: ItemType.SfMove
}

///////////////////////////////

export type ItemDataSource =
  | AssetDataSource
  | ProgressDataSource
  | VowDataSource
  | BondsetDataSource
  | MoveDataSource
  | SFMoveDataSource
  | DelveThemeDataSource
  | DelveDomainDataSource
export type ItemDataProperties =
  | AssetDataProperties
  | ProgressDataProperties
  | VowDataProperties
  | BondsetDataProperties
  | MoveDataProperties
  | SFMoveDataProperties
  | DelveThemeDataProperties
  | DelveDomainDataProperties

declare global {
  interface SourceConfig {
    Item: ItemDataSource
  }

  interface DataConfig {
    Item: ItemDataProperties
  }
}
