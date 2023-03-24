type CompendiumDocumentType = (typeof CONST.COMPENDIUM_DOCUMENT_TYPES)[number]

interface ClassHaver {
	documentClass: any
}

type DocType = Exclude<
	| (typeof CONST.DOCUMENT_TYPES)[number]
	| keyof ExtractByType<typeof CONFIG, ClassHaver>,
	`${Lowercase<string>}${string}`
>

type DocumentClass<TName extends DocType = DocType> = InstanceType<
	(typeof CONFIG)[TName]['documentClass']
>

type DocumentSource<TName extends DocType = DocType> =
	DocumentClass<TName>['_source']

type ExtractByType<TObject, TValue> = {
	[K in keyof TObject as Required<TObject>[K] extends TValue
		? K
		: never]: Required<TObject>[K] extends TValue ? TObject[K] : never
}

interface DocumentFlags {
	'foundry-ironsworn'?: {
		'edit-mode'?: boolean
		muteBroadcast?: boolean
	}
}
