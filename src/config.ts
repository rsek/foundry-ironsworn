import { IronswornActor } from './module/actor/actor'
import * as dataforgedHelpers from './module/dataforged'
import { importFromDatasworn } from './module/datasworn'
import { starforged } from 'dataforged'
import type { Emitter, EventType } from 'mitt'
import Mitt from 'mitt'
import {
	IronswornRoll,
	IronswornPrerollDialog,
	IronswornRollMessage,
	OracleRollMessage
} from './module/rolls'
import { AssetCompendiumBrowser } from './module/item/asset-compendium-browser'
import { FirstStartDialog } from './module/applications/firstStartDialog'
import { SFSettingTruthsDialogVue } from './module/applications/vueSfSettingTruthsDialog'
import { WorldTruthsDialog } from './module/applications/worldTruthsDialog'
import { OracleWindow } from './module/applications/oracle-window'
import type { Constructor } from './module/vue/vueapp'
import type { IronswornItem } from './module/item/item'
import type { IronswornJournalPage } from './module/journal/journal-entry-page'

export interface EmitterEvents extends Record<EventType, unknown> {
	highlightMove: string // Foundry UUID
	highlightOracle: string // DF ID
	globalConditionChanged: { name: string; enabled: boolean } // info about condition that changed
	dragStart: string // type of item
	dragEnd: string // type of item
}
export type IronswornEmitter = Emitter<EmitterEvents>

export interface IronswornConfig {
	actorClass: typeof IronswornActor
	importFromDatasworn: typeof importFromDatasworn

	applications: {
		// Dialogs
		FirstStartDialog: typeof FirstStartDialog
		ISSettingTruthsDialog: typeof WorldTruthsDialog
		SFSettingTruthsDialog: typeof SFSettingTruthsDialogVue
		AssetCompendiumBrowser: typeof AssetCompendiumBrowser
		OracleWindow: typeof OracleWindow

		// Rolling
		IronswornRoll: typeof IronswornRoll
		IronswornPrerollDialog: typeof IronswornPrerollDialog
		IronswornRollMessage: typeof IronswornRollMessage
		OracleRollMessage: typeof OracleRollMessage
	}

	Dataforged: typeof starforged
	dataforgedHelpers: typeof dataforgedHelpers

	emitter: IronswornEmitter
}

declare global {
	type ConfiguredConfig = Config<
		AmbientLightDocument,
		ActiveEffect,
		IronswornActor,
		ActorDirectory<IronswornActor>,
		ChatLog<ChatMessage<IronswornActor>>,
		ChatMessage<IronswornActor>,
		Combat,
		Combatant<Combat | null, IronswornActor | null>,
		CombatTracker<Combat>,
		CompendiumDirectory,
		Hotbar,
		IronswornItem,
		Macro,
		MeasuredTemplateDocument,
		TileDocument,
		TokenDocument,
		WallDocument<Scene | null>,
		Scene,
		User<IronswornActor>,
		EffectsCanvasGroup,
		IronswornJournalPage
	> & {
		Canvas: {
			layers: Record<
				string,
				{ group: 'primary' | 'interface'; layerClass: Constructor<CanvasLayer> }
			>
		}
	}
	interface IronGame
		extends Game<
			IronswornActor,
			Actors<IronswornActor>,
			ChatMessage,
			Combat,
			IronswornItem,
			Macro,
			Scene,
			User<IronswornActor>
		> {}

	interface ConfigIronsworn extends ConfiguredConfig {
		IRONSWORN: IronswornConfig
	}

	const CONFIG: ConfigIronsworn

	namespace globalThis {
		// eslint-disable-next-line no-var
		var game: IronGame

		// eslint-disable-next-line no-var
		var canvas: Canvas

		// eslint-disable-next-line no-var
		var ui: FoundryUI<
			IronswornActor,
			ActorDirectory<IronswornActor>,
			IronswornItem,
			ChatLog,
			CompendiumDirectory
		>
	}
}

export const IRONSWORN: IronswornConfig = {
	actorClass: IronswornActor,

	applications: {
		FirstStartDialog,
		ISSettingTruthsDialog: WorldTruthsDialog,
		SFSettingTruthsDialog: SFSettingTruthsDialogVue,
		AssetCompendiumBrowser,
		OracleWindow,

		IronswornRoll,
		IronswornPrerollDialog,
		IronswornRollMessage,
		OracleRollMessage
	},

	importFromDatasworn,

	Dataforged: starforged,
	dataforgedHelpers,

	emitter: Mitt<EmitterEvents>()
}
