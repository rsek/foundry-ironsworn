export type SchemaOf<T extends foundry.abstract.Document<any, any, any>> = {
	[P in keyof T]: DocumentField<T[P]>
}

declare global {
	namespace ClientDocumentMixin {
		interface CompendiumExportOptions {
			clearOwnership?: boolean
		}
	}
}

export {}
