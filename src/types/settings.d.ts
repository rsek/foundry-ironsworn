import 'foundry-types'

// configuration specific to this module
declare global {
	/* eslint-disable @typescript-eslint/consistent-type-imports */
	interface CONFIG {
		IRONSWORN: import('../config').IronswornConfig
	}
	/** Settings added here will be automatically typed throughout the game system. */
	interface IronClientSettingsConfig {
		// types for core settings from foundry's source -- non-exhaustive
		core: {
			compendiumConfiguration: Record<
				string,
				{ private: boolean; locked: boolean }
			>
			defaultToken: Partial<foundry.data.PrototypeTokenSource>
			rollMode: RollMode
			sheetClasses: {
				[TDoc in DocType & keyof typeof game.system.documentTypes]?: Record<
					DocSubtype<TDoc>,
					string
				>
			}
		}
	}
}

// augments for stuff that foundry-types doesn't cover
declare global {
	interface SettingData {
		/** The _id which uniquely identifies this Setting document */
		_id: string
		/** The setting key, a composite of {scope}.{name} */
		key: string
		/** The setting value, which is serialized to JSON */
		value: any
		/**
		 * An object of creation and access information
		 */
		_stats?: DocumentStats
	}

	interface FoundryUI<
		TActor extends Actor<null>,
		TActorDirectory extends ActorDirectory<TActor>,
		TItem extends Item<null>,
		TChatLog extends ChatLog,
		TCompendiumDirectory extends CompendiumDirectory
	> {
		menu: MainMenu
		sidebar: Sidebar
		pause: Pause
		nav: SceneNavigation
		notifications: Notifications
		// actors: ActorDirectory
		// cards: CardsDirectory
		// chat: ChatLog
		// combat: CombatTracker
		// compendium: CompendiumDirectory
		controls: SceneControls
		hotbar: Hotbar
		// items: ItemDirectory
		// journal: JournalDirectory
		// macros: MacroDirectory
		players: PlayerList
		// playlists: PlaylistDirectory
		// scenes: SceneDirectory
		settings: Settings
		tables: RollTableDirectory
		// webrtc: CameraViews
	}
}

declare module 'foundry-types' {
	/**
	 * The Document definition for a Setting.
	 * Defines the DataSchema and common behaviors for a Setting which are shared between both client and server.
	 */
	class BaseSetting
		extends foundry.abstract.Document<any>
		implements SettingData
	{
		/**
		 * @param data Initial data from which to construct the Setting
		 * @param context Construction context options
		 */
		constructor(data: SettingData, context: DocumentConstructionContext<any>)
		key: string
		value: any
		_stats?: DocumentStats | undefined
		_id: string
	}
	class Setting extends BaseSetting {}
}

export {}
