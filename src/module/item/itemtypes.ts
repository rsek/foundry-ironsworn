import type {
  ItemDataBaseProperties,
  ItemDataBaseSource,
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData.js'
import type { IMove } from 'dataforged'
import type { RANKS } from '../constants'

interface ProgressBase {
  /**
   * The challenge rank of the progress track.
   */
  rank: keyof typeof RANKS
  /**
   * The current amount of marked progress, in ticks (4 ticks = 1 box).
   * @defaultValue `0`
   */
  current: number
  /**
   * Is this progress track marked as 'completed' on the character sheet?
   * @defaultValue `false`
   */
  completed: boolean
}

///////////////////////////////

interface AssetField {
  /**
   * The name of this field, used as a label when rendering.
   */
  name: string
  /**
   * The user-supplied text value for this field.
   */
  value: string
}

export interface AssetAbility {
  name?: string
  /**
   * Is this asset ability active?
   */
  enabled: boolean
  /**
   * The text content of this asset ability.
   */
  description: string
  /**
   * Does this asset ability have an embedded clock?
   */
  hasClock: boolean
  /**
   * The maximum number of fillable clock segments.
   */
  clockMax: number
  /**
   * The number of clock segments that are currently filled.
   */
  clockTicks: number
}

interface AssetExclusiveOption {
  /**
   * The name, used as a label when rendering this option.
   */
  name: string
  /**
   * Is this option currently selected?
   */
  selected: boolean
}

interface AssetDataSourceData {
  /**
   * Text input fields for this asset.
   */
  fields: AssetField[]
  /**
   * This asset's three asset abilities.
   */
  abilities: [AssetAbility, AssetAbility, AssetAbility]
  /**
   * The asset track, for an asset-specific resource, if any.
   * Starforged disambiguates these from progress tracks by terming them "condition meters" (which would be a good thing to rename them t)
   */
  track: {
    /**
     * Is the track enabled?
     */
    enabled: boolean
    name: string
    current: number
    max: number
  }
  exclusiveOptions: AssetExclusiveOption[]
}

interface AssetDataPropertiesData extends AssetDataSourceData {}

export interface AssetDataSource extends ItemDataBaseSource {
  type: 'asset'
  data: AssetDataSourceData
}

export interface AssetDataProperties extends ItemDataBaseProperties {
  type: 'asset'
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

export interface ProgressDataSource extends ItemDataBaseSource {
  type: 'progress'
  data: ProgressDataSourceData
}
export interface ProgressDataProperties extends ItemDataBaseProperties {
  type: 'progress'
  data: ProgressDataPropertiesData
}

///////////////////////////////

interface VowDataSourceData extends ProgressBase {
  description: string
  threat: string
  menace: number
}
interface VowDataPropertiesData extends VowDataSourceData {}

export interface VowDataSource extends ItemDataBaseSource {
  type: 'vow'
  data: VowDataSourceData
}
export interface VowDataProperties extends ItemDataBaseProperties {
  type: 'vow'
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
interface BondsetDataPropertiesData extends BondsetDataSourceData {}

export interface BondsetDataSource extends ItemDataBaseSource {
  type: 'bondset'
  data: BondsetDataSourceData
}
export interface BondsetDataProperties extends ItemDataBaseProperties {
  type: 'bondset'
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

export interface DelveThemeDataSource extends ItemDataBaseSource {
  type: 'delve-theme'
  data: DelveThemeDataSourceData
}
export interface DelveThemeDataProperties extends ItemDataBaseProperties {
  type: 'delve-theme'
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

export interface DelveDomainDataSource extends ItemDataBaseSource {
  type: 'delve-domain'
  data: DelveDomainDataSourceData
}
export interface DelveDomainDataProperties extends ItemDataBaseProperties {
  type: 'delve-domain'
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

export interface MoveDataSource extends ItemDataBaseSource {
  type: 'move'
  data: MoveDataSourceData
}
export interface MoveDataProperties extends ItemDataBaseProperties {
  type: 'move'
  data: MoveDataPropertiesData
}

///////////////////////////////

interface SFMoveDataPropertiesData extends IMove {
  dfid: string
}

export interface SFMoveDataSource extends ItemDataBaseSource {
  type: 'sfmove'
  data: IMove
}
export interface SFMoveDataProperties extends ItemDataBaseProperties {
  type: 'sfmove'
  data: SFMoveDataPropertiesData
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
