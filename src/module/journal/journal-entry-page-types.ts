import type { ChallengeRank } from '../constants'
import { IronswornJournalPage } from './journal-entry-page'

interface CounterBase {
	max: number
	value: number
}

interface Threat extends CounterBase {
	name: string
	enabled: boolean
}

interface Countdown extends CounterBase {
	name: string
	enabled: boolean
}

/// //////// PROGRESS

interface ProgressTrack {
	ticks: number
	rank: ChallengeRank
	/**
	 * For Threat/Menace from Ironsworn: Delve.
	 */
	threat?: Threat
	/**
	 * For classic Ironsworn scene challenges.
	 */
	countdown?: Countdown
}

export interface ProgressTrackSystem extends ProgressTrack {}

export interface ProgressTrackDataSource {
	// distinguish progress types with different sheets?
	type: 'progress'
	system: ProgressTrackSystem
}

/// //////// CLOCKS

export interface ClockSystem extends CounterBase {
	clockType: 'tension' | 'campaign'
}
export interface ClockDataSource {
	type: 'clock'
	system: ClockSystem
}

declare global {
	type JournalEntryPageSystemMap = {
		progress: ProgressTrackDataSource
		clock: ClockDataSource
	} & {
		[K in foundry.JournalEntryPageMetadata['coreTypes'][number]]: {
			system: object
		}
	}
	type JournalEntryPageTypeMap = {
		[K in keyof JournalEntryPageSystemMap]: JournalEntryPageSystemMap[K] &
			IronswornJournalPage
	}
	type JournalEntryPageType = keyof JournalEntryPageSystemMap
}
