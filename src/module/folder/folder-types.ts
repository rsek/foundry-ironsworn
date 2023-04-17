import type { FOLDER_DOCUMENT_TYPES } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/constants.mjs'
import type { ConfiguredDocumentClassForName } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'

export type FolderableDocument = InstanceType<
	ConfiguredDocumentClassForName<FOLDER_DOCUMENT_TYPES>
>

declare global {
	interface FlagConfig {
		Folder: {
			'foundry-ironsworn': {
				dfid?: string
				parentDfid?: string
			}
		}
	}
}

export {}
