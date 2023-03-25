import { clamp } from 'lodash-es'
import { ChallengeRank, RANK_INCREMENTS } from '../constants'
import type {
	JournalEntryPageSourceMap,
	JournalEntryPageSystemMap
} from './journal-entry-page-types'

declare global {
	interface MergeObjectOptions {
		recursive?: boolean
	}
}

/**
 * Extends the base {@link JournalEntryPage} document class.
 */
export class IronswornJournalPage<
	T extends JournalEntryPageType = JournalEntryPageType
> extends JournalEntryPage<JournalEntry | null> {
	type!: T
	data!: foundry.abstract.Document & { _source: JournalEntryPageSourceMap[T] }
	system!: JournalEntryPageSystemMap[T]
	_source!: JournalEntryPageSourceMap[T]

	protected override async _preCreate(
		data: PreDocumentId<this['_source']>,
		options: DocumentModificationContext<JournalEntry>,
		user: foundry.documents.BaseUser
	): Promise<void> {
		// FIXME: JEPs aren't initialized with proper defaults, so we DIY it.
		// https://github.com/foundryvtt/foundryvtt/issues/8628
		const defaults = (game.system as any).template.JournalEntryPage?.[
			data.type
		] as this['_source']
		if (defaults != null) {
			const alreadySet = data.system
			const newSourceData = mergeObject(defaults, alreadySet ?? {}, {
				recursive: true
			})
			this.updateSource({ system: newSourceData })
		}
		await super._preCreate(data, options, user)
	}

	// PROGRESS METHODS
	/**
	 * Mark progress on a progress track.
	 * @param progressUnits The number of times that progress is to be marked.
	 */
	async markProgress(progressUnits = 1) {
		if (this.type !== 'progress') return
		const system = (this as IronswornJournalPage<'progress'>).system
		const legacyRank = ChallengeRank[system.rank]
		const oldTicks = system.ticks ?? 0
		const minTicks = 0
		const maxTicks = 40
		const increment = RANK_INCREMENTS[legacyRank] * progressUnits
		const newValue = clamp(oldTicks + increment, minTicks, maxTicks)
		return await this.update({ 'system.ticks': newValue })
	}
}
