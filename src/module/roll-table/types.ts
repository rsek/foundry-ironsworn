import type { ConfiguredDocumentClassForName } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import { ConfiguredDocumentClass } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import { Simplify } from 'type-fest'
import { IndexEntry } from '../../types/compendium'
import { OracleTable } from './oracle-table'

declare global {
	/** A Collection of Compendium Folders
	 */
	class CompendiumFolderCollection extends DocumentCollection<
		ConfiguredDocumentClassForName<'Folder'>,
		'folders'
	> {
		/**
		 * The CompendiumPack instance which contains this CompendiumFolderCollection
		 */
		pack: Compendium<any, any>
	}
	export type OracleIndexEntry = IndexEntry<OracleTable, 'formula'>
}
