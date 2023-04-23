import type { InjectionKey, Ref } from 'vue'
import type { enrichHtml, enrichMarkdown } from './vue-plugin'
import type { IronswornActor } from '../actor/actor'
import type { IronswornItem } from '../item/item'
import type { Emitter, EventType } from 'mitt'
import type { IronswornJournalPage } from '../journal/journal-entry-page'
import type { OracleTable } from '../roll-table/oracle-table'
import type { helpers } from '../../types/utils'
import { OracleTree } from '../roll-table/oracle-tree'

// Provided by the Vue plugin
export const $EnrichHtmlKey = Symbol('$enrichHtml') as InjectionKey<
	typeof enrichHtml
>
export const $EnrichMarkdownKey = Symbol('$enrichMarkdown') as InjectionKey<
	typeof enrichMarkdown
>

// Provided by the render helper
export interface LocalEmitterEvents extends Record<EventType, unknown> {
	closeApp: void
	activateTab: string
}
export type LocalEmitter = Emitter<LocalEmitterEvents>
export const $LocalEmitterKey = Symbol(
	'$localEmitter'
) as InjectionKey<LocalEmitter>

// Sheets have to provide these
export const $ActorKey = Symbol('$actor') as InjectionKey<IronswornActor>
export const ActorKey = Symbol('actor') as InjectionKey<
	Ref<helpers.SourceDataType<IronswornActor>>
>

export const $ItemKey = Symbol('$item') as InjectionKey<IronswornItem>
export const ItemKey = Symbol('item') as InjectionKey<
	Ref<helpers.SourceDataType<IronswornItem>>
>

export const $PageKey = Symbol('$page') as InjectionKey<IronswornJournalPage>
export const PageKey = Symbol('page') as InjectionKey<
	Ref<helpers.SourceDataType<IronswornJournalPage>>
>

export const $OracleKey = Symbol('$oracle') as InjectionKey<OracleTable>
export const OracleKey = Symbol('oracle') as InjectionKey<
	Ref<helpers.SourceDataType<OracleTable>>
>

// export const $OracleNodesKey = Symbol('$oracleNodes') as InjectionKey<
// 	OracleTree.Node[]
// >
// export const OracleNodes = Symbol('oracleNodes') as InjectionKey<
// 	Ref<helpers.SourceDataType<OracleTree.Node>[]>
// >
