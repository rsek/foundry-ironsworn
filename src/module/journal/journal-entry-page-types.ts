import type { ISettingTruthOption } from 'dataforged'
import type { ChallengeRank } from '../constants'
import type { IronswornJournalPage } from './journal-entry-page'

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

interface ProgressTrackSystemSource extends ProgressTrack {}

/// //////// CLOCKS

export interface ClockSystemSource extends CounterBase {
	clockType: 'tension' | 'campaign'
}

/// /////// SETTING TRUTHS

interface SettingTruthOptionSystemSource extends ISettingTruthOption {}

/// ///////

export interface JournalEntryPageSystemMap {
	progress: ProgressTrackSystemSource
	clock: ClockSystemSource
	truth: SettingTruthOptionSystemSource
	text: object
	pdf: object
	image: object
	video: object
}

export type JournalEntryPageSourceMap = {
	[K in keyof JournalEntryPageSystemMap]: foundry.documents.JournalEntryPageSource & {
		type: K
		system: JournalEntryPageSystemMap[K]
	}
}

declare global {
	type JournalEntryPageType = keyof JournalEntryPageSystemMap
	type JournalEntryPageTypeMap = {
		[K in JournalEntryPageType]: IronswornJournalPage<K>
	}
	interface IronswornJournalEntryPageData<T extends JournalEntryPageType> {
		_source: JournalEntryPageSourceMap[T]
	}
	type IronswornJournalEntryPageSource<
		T extends JournalEntryPageType = JournalEntryPageType
	> = JournalEntryPageSourceMap[T]
}
