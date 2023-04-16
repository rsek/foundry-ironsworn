import type { FOLDER_DOCUMENT_TYPES } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/constants.mjs'
import type { ConfiguredDocumentClassForName } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import type { IronFolder } from './iron-folder'

export type FolderableDocument = InstanceType<
	ConfiguredDocumentClassForName<FOLDER_DOCUMENT_TYPES>
>

declare global {
	interface Folder {
		type: this['data']['type']
	}
	interface DocumentClassConfig {
		Folder: typeof IronFolder
	}
	interface FlagConfig {
		Folder: {
			'foundry-ironsworn': {
				dfid: string
			}
		}
	}
}

export {}
