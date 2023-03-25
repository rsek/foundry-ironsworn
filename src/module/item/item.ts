import { RANK_INCREMENTS } from '../constants'
import { getFoundryMoveByDfId } from '../dataforged'
import { IronswornPrerollDialog } from '../rolls'
import type {
	DelveSiteDanger,
	DelveSiteFeature,
	IronswornItemData,
	ItemSourceMap,
	ItemSystemMap
} from './itemtypes'

/**
 * Extend the base Item entity
 */
export class IronswornItem<T extends ItemType = ItemType> extends Item<any> {
	get type(): T {
		return super.type as T
	}

	system!: ItemSystemMap[T]
	data!: IronswornItemData<T>
	_source!: ItemSourceMap[T]

	protected override _onCreate(data: this['_source'], options, userId) {
		super._onCreate(data, options, userId)

		switch (this.type) {
			case 'delve-theme':
			case 'delve-domain':
				{
					const system = (this as IronswornItem<'delve-theme' | 'delve-domain'>)
						.system
					// initialize sourceId flags for delve site features and dangers
					const features = system.features.map((feature: DelveSiteFeature) => {
						feature.flags['foundry-ironsworn'].sourceId = this.id
						return feature
					})
					const dangers = system.dangers.map((danger: DelveSiteDanger) => {
						danger.flags['foundry-ironsworn'].sourceId = this.id
						return danger
					})
					this.update({ system: { features, dangers } })
				}
				break

			default:
				break
		}
	}

	/**
	 * Progress methods
	 */
	async markProgress(numMarks = 1) {
		if (this.type !== 'progress') return
		const system = (this as IronswornItem<'progress'>).system
		const increment = RANK_INCREMENTS[system.rank] * numMarks
		let newValue = system.current + increment
		newValue = Math.min(newValue, 40)
		newValue = Math.max(newValue, 0)
		await this.update({ 'system.current': newValue })
	}

	async clearProgress() {
		if (this.type !== 'progress') await this.update({ 'system.current': 0 })
	}

	async fulfill() {
		if (this.type !== 'progress') return
		const system = (this as IronswornItem<'progress'>).system

		let moveDfId: string | undefined
		if (system.subtype === 'vow') {
			const toolset = this.actor?.toolset ?? 'starforged'
			moveDfId =
				toolset === 'starforged'
					? 'Starforged/Moves/Quest/Fulfill_Your_Vow'
					: 'Ironsworn/Moves/Quest/Fulfill_Your_Vow'
		}

		const progress = Math.floor(system.current / 4)
		return await IronswornPrerollDialog.showForProgress(
			this.name ?? '(progress)',
			progress,
			this.actor ?? undefined,
			moveDfId
		)
	}

	/**
	 * Bondset methods
	 */
	async writeEpilogue() {
		if (this.type !== 'bondset') return
		const system = (this as IronswornItem<'bondset'>).system

		const move = await getFoundryMoveByDfId(
			'Ironsworn/Moves/Relationship/Write_Your_Epilogue'
		)
		if (move == null) throw new Error('Problem loading write-epilogue move')

		const progress = Math.floor(Object.values(system.bonds).length / 4)
		IronswornPrerollDialog.showForOfficialMove(
			'Ironsworn/Moves/Relationship/Write_Your_Epilogue',
			{
				actor: this.actor ?? undefined,
				progress: {
					source: game.i18n.localize('IRONSWORN.ITEMS.TypeBond'),
					value: progress
				}
			}
		)
	}

	/**
	 * Move methods
	 */
	isProgressMove(): boolean | undefined {
		if (this.type !== 'sfmove') return

		const system = (this as IronswornItem<'sfmove'>).system
		return system.Trigger.Options?.some(
			(option) => option['Roll type'] === 'Progress roll'
		)
	}
}
