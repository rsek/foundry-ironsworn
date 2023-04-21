import type { FOLDER_DOCUMENT_TYPES } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/constants.mjs'
import type { ConfiguredDocumentClassForName } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import type { IAssetType, IHasId, IMoveCategory } from 'dataforged'
import type {
	IOracleBranch,
	IOracleCategoryBranch
} from '../roll-table/roll-table-types'
import type { IronFolder } from './folder'

export type FolderableDocument = InstanceType<
	ConfiguredDocumentClassForName<FOLDER_DOCUMENT_TYPES>
>

export type FolderType = 'oracles' | 'moves' | 'assets'

interface FolderTypeMap extends Record<FolderType, IHasId> {
	oracles: Pick<
		IOracleBranch | IOracleCategoryBranch,
		'$id' | 'Source' | 'Category'
	>
	moves: Pick<IMoveCategory, '$id' | 'Source'>
	assets: Pick<IAssetType, '$id' | 'Source'>
}

declare global {
	interface FlagConfig {
		Folder: {
			'foundry-ironsworn'?: {
				dataforged?: ValueOf<FolderTypeMap>
				forceExpanded?: boolean
				type?: FolderType
				/**
				 * Is this document visible in the sidebar directory?
				 * @remarks This overrides `Document#visible`, and will fall back to that value if left unset.
				 */
				visible?: boolean
			}
		}
	}
	interface DocumentClassConfig {
		Folder: typeof IronFolder
	}
}

export {}
