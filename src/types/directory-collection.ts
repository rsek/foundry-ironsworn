/* eslint-disable @typescript-eslint/prefer-function-type */
/* eslint-disable import/export */
import type {
	FolderDataProperties,
	FolderDataSource,
	SortingModes
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/folderData'
import type { CONST } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/module.mjs'
import type {
	ConfiguredDocumentClassForName,
	ConfiguredFlags,
	SourceDataType
} from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import type { IronFolder } from '../module/folder/folder'
import type { PackableDocument } from '../module/folder/folder-types'
import type {
	Jsonify,
	JsonPrimitive,
	Get,
	Simplify,
	RequiredDeep
} from 'type-fest'
import type { DIRECTORY_SEARCH_MODES } from './default'

export type PackableDocumentConstructor =
	ConfiguredDocumentClassForName<CONST.COMPENDIUM_DOCUMENT_TYPES>

declare global {
	const DirectoryCollectionMixin: <
		TDocumentConstructor extends PackableDocumentConstructor,
		TIndexEntry extends IndexEntry<InstanceType<TDocumentConstructor>>,
		Name extends string
	>(
		Base: ConstructorOf<DocumentCollection<TDocumentConstructor, Name>>
	) => DirectoryCollectionConstructor<TDocumentConstructor, TIndexEntry, Name>

	type DirectoryCollectionConstructor<
		TDocumentConstructor extends PackableDocumentConstructor,
		TIndexEntry extends IndexEntry<InstanceType<TDocumentConstructor>>,
		Name extends string
	> = Pick<
		DocumentCollection<TDocumentConstructor, Name>,
		keyof DocumentCollection<TDocumentConstructor, Name>
	> &
		Pick<
			typeof DirectoryCollectionMixin<TDocumentConstructor, TIndexEntry, Name>,
			keyof typeof DirectoryCollectionMixin<
				TDocumentConstructor,
				TIndexEntry,
				Name
			>
		> & {
			new (
				...args: ConstructorParameters<
					ConstructorOf<DocumentCollection<TDocumentConstructor, Name>>
				>
			): DocumentCollection<TDocumentConstructor, Name> &
				DirectoryCollectionMixin<TDocumentConstructor, TIndexEntry, Name>
		}

	namespace DirectoryCollectionMixin {
		export interface Tree<T extends PackableDocument, I extends IndexEntry<T>> {
			root: boolean
			folder:
				| (FolderDataSource & {
						uuid: string
				  })
				| null
			depth: number
			visible: boolean
			children: Tree<T, I>[]
			entries: I[]
		}
	}
}

export declare class DirectoryCollectionMixin<
	TDocumentConstructor extends PackableDocumentConstructor,
	TIndexEntry extends IndexEntry<InstanceType<TDocumentConstructor>>,
	Name extends string
> extends DocumentCollection<TDocumentConstructor, Name> {
	/**
	 * Reference the set of Folders which contain documents in this collection
	 */
	get folders(): Collection<
		ConfiguredDocumentClassForName<'Folder'> & {
			type: TDocumentConstructor['documentName']
		}
	>
	/**
	 * The built tree structure of the DocumentCollection
	 */
	get tree(): DirectoryCollectionMixin.Tree<
		InstanceType<TDocumentConstructor>,
		TIndexEntry
	>

	#tree: DirectoryCollectionMixin.Tree<
		InstanceType<TDocumentConstructor>,
		TIndexEntry
	>

	/**
	 * The current search mode for this collection
	 */
	get searchMode(): DIRECTORY_SEARCH_MODES
	/**
	 * Toggle the search mode for this collection between "name" and "full" text search
	 */
	toggleSearchMode: () => void
	/**
	 * The current sort mode used to order the top level entries in this collection
	 */
	get sortingMode(): SortingModes
	toggleSortingMode: () => void
	/**
	 * The maximum depth of folder nesting which is allowed in this collection
	 */
	get maxFolderDepth(): typeof CONST.FOLDER_MAX_DEPTH
	/**
	 * Return a reference to list of entries which are visible to the User in this tree
	 * @private
	 */
	protected _getVisibleTreeContents: () => this['contents']
	/**
	 * Initialize the tree by categorizing folders and entries into a hierarchical tree structure.
	 */
	initializeTree: () => void

	/**
	 * Given a list of Folders and a list of Entries, set up the Folder tree
	 * @param folders The Array of Folder objects to organize
	 * @param entries The Array of Entries objects to organize
	 * @returns A tree structure containing the folders and entries
	 */
	#buildTree(
		folders: (ConfiguredDocumentClassForName<'Folder'> & {
			type: TDocumentConstructor['documentName']
		})[],
		entries: TIndexEntry[]
	): DirectoryCollectionMixin.Tree<
		InstanceType<TDocumentConstructor>,
		TIndexEntry
	>

	/**
	 * Sort two Entries by name, alphabetically.
	 * @param a Some Entry
	 * @param b Some other Entry
	 * @returns The sort order between entries a and b
	 * @protected
	 */
	static _sortAlphabetical(a: { name: string }, b: { name: string }): number
	/**
	 * Sort two Entries using their numeric sort fields.
	 * @param a Some Entry
	 * @param b Some other Entry
	 * @returns The sort order between entries a and b
	 * @protected
	 */
	static _sortStandard(a: { sort: number }, b: { sort: number }): number
}

type Dot<T extends string | number, U extends string | number> = '' extends T
	? U
	: '' extends U
	? T
	: `${T}.${U}`

type StrictProps<T> = T extends object
	? Jsonify<
			Required<Exclude<OmitOfType<T, (...args: any[]) => any>, undefined>>
	  >
	: T

type PathsToProps<T> = T extends (...args: any) => any
	? never
	: StrictProps<T> extends JsonPrimitive
	? ''
	: {
			[K in Extract<keyof T, string | number>]-?: Dot<K, PathsToProps<T[K]>>
	  }[Extract<keyof T, string | number>]

// type RollTablePaths = PathsToProps<RollTableDataSource>
export type FieldPaths<T extends PackableDocument> = PathsToProps<
	SourceDataType<T>
> &
	string

type IndexKeysCommon =
	| 'uuid'
	| '_id'
	| 'name'
	| 'sort'
	| 'description'
	| 'folder'
	| 'img'

export type IndexEntry<
	T extends PackableDocument,
	Paths extends FieldPaths<T> | never = never
> = Simplify<
	Expanded<{
		[K in Paths | IndexKeysCommon as K]-?: Get<
			RequiredDeep<Omit<SourceDataType<T>, 'flags'>>,
			K
		>
	}> & { uuid: string; _id: string; flags: ConfiguredFlags<T['documentName']> }
>
