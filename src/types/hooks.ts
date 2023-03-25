import 'foundry-types'

declare module 'foundry-types' {
	interface DocumentStats {
		/** The package name of the system the Document was created in. */
		systemId: string
		/** The version of the system the Document was created in. */
		systemVersion: string
		/** The core version the Document was created in. */
		coreVersion: string
		/** A timestamp of when the Document was created. */
		createdTime: number
		/** A timestamp of when the Document was last modified. */
		modifiedTime: number
		/** The ID of the user who last modified the Document. */
		lastModifiedBy: string
	}

	namespace Hooks {
		type HookParamsPreCreate<
			T extends foundry.abstract.Document,
			N extends string
		> = HookParameters<
			`preCreate${N}`,
			[T, PreCreate<T>, DocumentModificationContext<T>, string]
		>
		type HookParamsPreUpdate<
			T extends foundry.abstract.Document,
			N extends string
		> = HookParameters<
			`preUpdate${N}`,
			[T, DocumentUpdateData<T>, DocumentUpdateContext<T>, string]
		>
		type HookParamsCreate<
			T extends foundry.abstract.Document,
			N extends string
		> = HookParameters<`create${N}`, [T, DocumentUpdateContext<T>, string]>

		// This is apparently how TS wants us to add static methods to existing class declarations.
		// see: https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-namespaces-with-classes

		export function on(
			...args: HookParamsPreUpdate<Actor<any>, 'Actor'>
		): number
		export function on(...args: HookParamsPreUpdate<Item<any>, 'Item'>): number
		export function on(...args: HookParamsPreUpdate<Setting, 'Setting'>): number
		export function on(
			...args: HookParamsRender<Compendium<any>, 'Compendium'>
		): number
		export function on(...args: HookParamsCreate<Actor<any>, 'Actor'>): number
		export function on(...args: HookParamsUpdate<Actor<any>, 'Actor'>): number
		export function on(...args: HookParamsUpdate<Item<any>, 'Item'>): number
		export function on(...args: HookParamsPreCreate<Item<any>, 'Item'>): number
		export function on(
			...args: HookParamsPreCreate<Actor<any>, 'Actor'>
		): number
		export function on(
			...args: HookParamsPreCreate<JournalEntryPage<any>, 'JournalEntryPage'>
		): number
		export function on(
			...args: HookParameters<'preDeleteItem', [Item<any>, any, number]>
		)
		export function on(...args: HookParameters<any, any>): number

		/**
		 * Notify subscribers that an error has occurred within foundry.
		 * @param location The method where the error was caught.
		 * @param error The error.
		 * @param options Additional options to configure behaviour.
		 */
		export function onError(
			location: string,
			error: Error,
			/**
			 * @default {}
			 */
			options?: {
				/**
				 * A message which should prefix the resulting error or notification.
				 * @default ""
				 */
				msg?: string
				/**
				 * The level at which to log the error to console (if at all).
				 * @default null
				 */
				log?: string | null
				/**
				 * The level at which to spawn a notification in the UI (if at all).
				 * @default null
				 */
				notify?: string | null
				/**
				 * Additional data to pass to the hook subscribers.
				 * @default {}
				 */
				data?: object
			}
		): void
	}
}
