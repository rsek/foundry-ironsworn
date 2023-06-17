import type { DataSchema } from '../../fields/utils'
import type { IronswornActor } from '../actor'
import { IronActorModel } from './common'

export class LocationData
	extends foundry.abstract.TypeDataModel<
		LocationDataSourceData,
		IronswornActor<'location'>
	>
	implements IronActorModel
{
	static _enableV10Validation = true

	/** Status effects toggles shown on tokens of this subtype **/
	get tokenStatusEffects(): IronActorModel['tokenStatusEffects'] {
		return []
	}

	static override defineSchema(): DataSchema<LocationDataSourceData> {
		const fields = foundry.data.fields
		return {
			subtype: new fields.StringField({ initial: 'star' }),
			klass: new fields.StringField({ nullable: true }),
			description: new fields.HTMLField()
		}
	}
}
export interface LocationData extends LocationDataSourceData {}

interface LocationDataSourceData {
	subtype: string
	klass: string | null
	description: string
}

export interface LocationDataSource {
	type: 'location'
	/**
	 * @deprecated
	 */
	data: LocationDataSourceData
	system: LocationDataSourceData
}
export interface LocationDataProperties {
	type: 'location'
	/**
	 * @deprecated
	 */
	data: LocationData
	system: LocationData
}
