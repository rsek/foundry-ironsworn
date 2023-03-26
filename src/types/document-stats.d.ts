declare global {
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
}

export {}
