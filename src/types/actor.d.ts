declare global {
	interface Actor<TParent extends TokenDocument<Scene | null> | null> {
		/**
		 * Create a new Token document, not yet saved to the database, which represents the Actor.
		 * @param data Additional data, such as x, y, rotation, etc. for the created token data
		 * @returns The created TokenDocument instance
		 */
		getTokenDocument: (
			data?: DeepPartial<foundry.documents.TokenSource>
		) => Promise<TokenDocument<any>>
	}
}
export {}
