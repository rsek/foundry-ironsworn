declare global {
	interface Localization {
		/**
		 * Return whether a certain string has a known translation defined.
		 * @param stringId The string key being translated
		 * @param fallback Allow fallback translations to count?
		 */
		has: (stringId: string, fallback?: boolean) => boolean
	}
}

export {}
