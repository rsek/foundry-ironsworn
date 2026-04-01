import type { DataSchema } from '../../fields/utils'
import type { IronswornItem } from '../item'

export class LedgerEntryModel extends foundry.abstract.TypeDataModel<
	LedgerEntryDataSourceData,
	LedgerEntryDataSourceData,
	IronswornItem<'ledger-entry'>
> {
	static _enableV10Validation = true

	static override defineSchema(): DataSchema<LedgerEntryDataSourceData> {
		const fields = foundry.data.fields
		return {
			completed: new fields.BooleanField({ initial: false }),
			valueBoxes: new fields.ArrayField(
				new fields.NumberField({ initial: 0, integer: true, min: 0, max: 2 }),
				{ initial: () => [0, 0, 0, 0, 0] }
			),
			description: new fields.HTMLField()
		}
	}
}
export interface LedgerEntryModel extends LedgerEntryDataSourceData {}

export interface LedgerEntryDataSourceData {
	description: string
	completed: boolean
	valueBoxes: number[]
}

export interface LedgerEntryDataSource {
	type: 'ledger-entry'
	data: LedgerEntryDataSourceData
	system: LedgerEntryDataSourceData
}
export interface LedgerEntryDataProperties {
	type: 'ledger-entry'
	data: LedgerEntryModel
	system: LedgerEntryModel
}
