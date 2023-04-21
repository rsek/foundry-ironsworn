import type { FOLDER_DOCUMENT_TYPES } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/constants.mjs'
import type { ConfiguredDocumentClassForName } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import type { IAssetType, IHasId, IMoveCategory } from 'dataforged'
import type { DataforgedFlags, StripDollars } from '../dataforged'
import type {
	IOracleBranch,
	IOracleCategoryBranch
} from '../roll-table/roll-table-types'
import type { IronFolder } from './folder'

export type FolderableDocument = InstanceType<
	ConfiguredDocumentClassForName<FOLDER_DOCUMENT_TYPES>
>

export type FolderType = 'oracles' | 'moves' | 'assets'

interface FolderTypeMap extends Record<FolderType, StripDollars<IHasId>> {
	oracles: DataforgedFlags<
		IOracleBranch | IOracleCategoryBranch,
		'$id' | 'Source' | 'Category'
	>
	moves: DataforgedFlags<IMoveCategory, '$id' | 'Source'>
	assets: DataforgedFlags<IAssetType, '$id' | 'Source'>
}

declare global {
	interface FlagConfig {
		Folder: {
			'foundry-ironsworn'?: {
				dataforged?: ValueOf<FolderTypeMap>
				forceExpanded?: boolean
				type?: FolderType
				/**
				 * Does this folder represent a canonical category?
				 */
				canonical?: boolean
			}
		}
	}
	interface DocumentClassConfig {
		Folder: typeof IronFolder
	}
}

export {}
