import type EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs'
import { ISettingTruth } from 'dataforged'
import type { IronswornJournalEntry } from './journal-entry'

// Type augments for base JournalEntry class

declare global {
	interface JournalEntry
		extends Omit<
			foundry.data.JournalEntryData,
			| 'update'
			| 'toObject'
			| 'toJSON'
			| 'permission'
			| 'name'
			| 'folder'
			| '_initializeSource'
		> {
		/**
		 * The pages contained within this JournalEntry document
		 */
		pages: EmbeddedCollection<
			DocumentClassConfig['JournalEntryPage'],
			// @ts-expect-error
			DocumentClassConfig['JournalEntry']
		>
	}
}

declare global {
	/** "Fake" JournalEntry types, set in the document flags at `foundry-ironsworn.type` */
	type JournalEntryType = 'truth-category' | 'base'

	interface FlagConfig {
		JournalEntry: {
			'foundry-ironsworn': {
				dataforged?: Pick<ISettingTruth, '$id' | 'Source' | 'Suggestions'>
				type?: JournalEntryType
			}
		}
	}

	interface JournalEntry
		extends Omit<
			foundry.data.JournalEntryData,
			| 'update'
			| 'toObject'
			| 'toJSON'
			| 'permission'
			| 'name'
			| 'folder'
			| '_initializeSource'
		> {
		/**
		 * The pages contained within this JournalEntry document
		 */
		pages: EmbeddedCollection<
			DocumentClassConfig['JournalEntryPage'],
			// @ts-expect-error
			DocumentClassConfig['JournalEntry']
		>
	}

	interface DocumentClassConfig {
		JournalEntry: typeof IronswornJournalEntry
	}
}
