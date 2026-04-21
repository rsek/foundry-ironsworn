import type { DataSchema } from '../../fields/utils'
import type { IronswornActor } from '../actor'

export class TreasuryModel extends foundry.abstract.TypeDataModel<
	TreasuryDataSourceData,
	TreasuryDataSourceData,
	IronswornActor<'treasury'>
> {
	static _enableV10Validation = true

	static override defineSchema(): DataSchema<TreasuryDataSourceData> {
		return {
			biography: new foundry.data.fields.HTMLField(),
			ship: new foundry.data.fields.StringField({ initial: '' }),
			commander: new foundry.data.fields.StringField({ initial: '' }),
			upkeep: new foundry.data.fields.StringField({ initial: '' }),
		}
	}
}
export interface TreasuryModel extends TreasuryDataSourceData {}

interface TreasuryDataSourceData {
	biography: string
	ship: string
	commander: string
	upkeep: string

}

export interface TreasuryDataSource {
	type: 'treasury'
	/**
	 * @deprecated
	 */
	data: TreasuryDataSourceData
	system: TreasuryDataSourceData
}
export interface TreasuryDataProperties {
	type: 'treasury'
	/**
	 * @deprecated
	 */
	data: TreasuryModel
	system: TreasuryModel
}
