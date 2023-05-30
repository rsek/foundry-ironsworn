import type { ConfiguredDocumentClassForName } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import { PackableDocument } from '../module/folder/folder-types'
import type {
	IndexEntry,
	DirectoryCollectionMixin
} from './directory-collection'

declare global {
	interface CompendiumCollection<T extends CompendiumCollection.Metadata>
		extends DirectoryCollectionMixin<
			ConfiguredDocumentClassForName<T['type']>,
			IndexEntry<InstanceType<ConfiguredDocumentClassForName<T['type']>>>,
			'CompendiumCollection'
		> {}
	namespace CompendiumCollection {
		export const _sortAlphabetical: typeof DirectoryCollectionMixin._sortAlphabetical
		export const _sortStandard: typeof DirectoryCollectionMixin._sortStandard
	}
}

/** An alias for {@link CompendiumCollection} with more intutive generic parameters. */
export type Pack<T extends PackableDocument['documentName']> =
	CompendiumCollection<CompendiumCollection.Metadata & { type: T }>
