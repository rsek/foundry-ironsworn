import 'foundry-types'

declare module 'foundry-types' {
	namespace ClientSettings {
		type DocSubtype<
			T extends DocType & keyof typeof game.system.documentTypes
		> = (typeof game.system.documentTypes)[T][number]

		interface Config {
			core: {
				compendiumConfiguration: Record<
					string,
					{ private: boolean; locked: boolean }
				>
				defaultToken: Partial<foundry.data.PrototypeTokenSource>
				rollMode: RollMode
				sheetClasses: {
					[TDoc in DocType & keyof typeof game.system.documentTypes]: Record<
						DocSubtype<TDoc>,
						string
					>
				}
			}
		}
	}

	interface ClientSettings {
		get: <
			TNamespace extends keyof ClientSettings.Config,
			TKey extends keyof ClientSettings.Config[TNamespace]
		>(
			module: TNamespace,
			key: TKey
		) => ClientSettings.Config[TNamespace][TKey]
	}
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
