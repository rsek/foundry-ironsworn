import { InjectionKey, Ref } from 'vue'
import { enrichHtml, enrichMarkdown } from './vue-plugin'
import { IronswornActor } from '../actor/actor'
import { IronswornItem } from '../item/item'
import {
  LocationDataSource,
  CharacterDataProperties,
  CharacterDataSource,
  FoeDataProperties,
  FoeDataSource,
  LocationDataProperties,
  SharedDataProperties,
  SharedDataSource,
  SiteDataProperties,
  SiteDataSource,
  StarshipDataProperties,
  StarshipDataSource,
  ActorDataSource,
  ActorDataProperties,
} from '../actor/actortypes.js'
import { Document } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/module.mjs.js'
import { BaseActor } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs/index.js'
import { ActorDataBaseSource } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData.js'

// Provided by the Vue plugin
export const $EnrichHtmlKey = Symbol('$enrichHtml') as InjectionKey<
  typeof enrichHtml
>
export const $EnrichMarkdownKey = Symbol('$enrichMarkdown') as InjectionKey<
  typeof enrichMarkdown
>

// intermediate type used for IronswornActorSource
type MergedIronswornActorSource<
  TSource extends ActorDataSource = ActorDataSource
> = ReturnType<typeof BaseActor.prototype.toObject> &
  ReturnType<typeof IronswornActor.prototype.toObject> &
  TSource

export type IronswornActorSource<
  TSource extends ActorDataSource = ActorDataSource
> = {
  [P in keyof MergedIronswornActorSource<TSource>]: P extends 'flags'
    ? Record<string, any>
    : // prefers TData's typings, then IronswornActor, then ActorDataBaseSource
    P extends keyof TSource
    ? TSource[P]
    : P extends keyof ReturnType<typeof IronswornActor.prototype.toObject>
    ? ReturnType<typeof IronswornActor.prototype.toObject>[P]
    : P extends keyof ActorDataBaseSource
    ? ActorDataBaseSource[P]
    : never
}

// intermediate type used for IronswornActorProperties
type MergedIronswornActorProperties<
  TProperties extends ActorDataProperties = ActorDataProperties
> = Actor & IronswornActor & TProperties

export type IronswornActorProperties<
  TProperties extends ActorDataProperties = ActorDataProperties
> =
  | {
      [P in keyof MergedIronswornActorProperties<TProperties>]: P extends keyof TProperties // prefers TProps's typings, then IronswornActor, then BaseActor
        ? TProperties[P]
        : P extends keyof IronswornActor
        ? IronswornActor[P]
        : P extends keyof Actor
        ? Actor[P]
        : never
    }
  | IronswornActor

// Sheets have to provide these
export const $ActorKey = Symbol(
  '$actor'
) as InjectionKey<IronswornActorProperties>
export const ActorKey = Symbol('actor') as InjectionKey<
  Ref<IronswornActorSource>
>

export const $CharacterKey = Symbol('$character') as InjectionKey<
  IronswornActorProperties<CharacterDataProperties>
>
export const CharacterKey = Symbol('character') as InjectionKey<
  Ref<IronswornActorSource<CharacterDataSource>>
>

export const $SiteKey = Symbol('$site') as InjectionKey<
  IronswornActorProperties<SiteDataProperties>
>
export const SiteKey = Symbol('site') as InjectionKey<
  Ref<IronswornActorSource<SiteDataSource>>
>

export const $SharedKey = Symbol('$shared') as InjectionKey<
  IronswornActorProperties<SharedDataProperties>
>
export const SharedKey = Symbol('shared') as InjectionKey<
  Ref<IronswornActorSource<SharedDataSource>>
>

export const $FoeKey = Symbol('$foe') as InjectionKey<
  IronswornActorProperties<FoeDataProperties>
>
export const FoeKey = Symbol('foe') as InjectionKey<
  Ref<IronswornActorSource<FoeDataSource>>
>

export const $StarshipKey = Symbol('$starship') as InjectionKey<
  IronswornActorProperties<StarshipDataProperties>
>
export const StarshipKey = Symbol('starship') as InjectionKey<
  Ref<IronswornActorSource<StarshipDataSource>>
>

export const $LocationKey = Symbol('$location') as InjectionKey<
  IronswornActorProperties<LocationDataProperties>
>
export const LocationKey = Symbol('location') as InjectionKey<
  Ref<IronswornActorSource<LocationDataSource>>
>

export const $ItemKey = Symbol('$item') as InjectionKey<IronswornItem>
export const ItemKey = Symbol('item') as InjectionKey<
  ReturnType<typeof IronswornItem.prototype.toObject>
>
