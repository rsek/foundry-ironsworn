import type { ConfiguredDocumentClassForName } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
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
