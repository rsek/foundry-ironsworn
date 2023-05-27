/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable @typescript-eslint/consistent-type-imports */
interface CONFIG {
	IRONSWORN: import('../config').IronswornConfig
}

export const DIRECTORY_SEARCH_MODES: {
	FULL: 'full'
	NAME: 'name'
}
export type DIRECTORY_SEARCH_MODES = ValueOf<typeof DIRECTORY_SEARCH_MODES>

export const DOCUMENT_TYPES: [
	'Actor',
	'Cards',
	'ChatMessage',
	'Combat',
	'Item',
	'Folder',
	'JournalEntry',
	'Macro',
	'Playlist',
	'RollTable',
	'Scene',
	'User'
]
export type DOCUMENT_TYPES = ValueOf<typeof DOCUMENT_TYPES>

export const FOLDER_DOCUMENT_TYPES: [
	'Actor',
	'Adventure',
	'Item',
	'Scene',
	'JournalEntry',
	'Playlist',
	'RollTable',
	'Cards',
	'Macro',
	'Compendium'
]
export type FOLDER_DOCUMENT_TYPES = ValueOf<typeof FOLDER_DOCUMENT_TYPES>

export const COMPENDIUM_DOCUMENT_TYPES: [
	'Actor',
	'Cards',
	'Item',
	'JournalEntry',
	'Macro',
	'Playlist',
	'RollTable',
	'Scene'
]
export type COMPENDIUM_DOCUMENT_TYPES = Exclude<
	DOCUMENT_TYPES,
	'ChatMessage' | 'Combat' | 'Folder' | 'User'
>

export const DOCUMENT_LINK_TYPES: [
	'Actor',
	'Cards',
	'Item',
	'Scene',
	'JournalEntry',
	'Macro',
	'RollTable',
	'PlaylistSound'
]
export type DOCUMENT_LINK_TYPES = ValueOf<typeof DOCUMENT_LINK_TYPES>
