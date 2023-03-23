import { clamp } from 'lodash-es'
import { ChallengeRank, RANK_INCREMENTS } from '../constants'

/**
 * Extends the base {@link JournalEntryPage} document class.
 */
export class IronswornJournalPage<
	TType extends JournalEntryPageType = JournalEntryPageType
> extends JournalEntryPage<
	JournalEntry | null,
	TType,
	JournalEntryPageSystemMap[TType]['system']
> {
	system!: JournalEntryPageSystemMap[TType]['system']
	get type(): TType {
		return super.type as TType
	}

	protected override async _preCreate(
		data: PreDocumentId<this['_source']>,
		options: DocumentModificationContext<this>,
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

declare global {
	interface DocumentClassConfig {
		JournalEntryPage: typeof IronswornJournalPage
	}
	// namespace Game {
	// 	interface SystemData<T> extends PackageData<T> {
	// 		model: {
	// 			JournalEntryPage: Record<string, Record<string, unknown>>
	// 		}
	// 		template: {
	// 			JournalEntryPage?: {
	// 				types: string[]
	// 				templates?: Record<string, unknown>
	// 			} & Record<string, unknown>
	// 		}
	// 	}
	// }
}
