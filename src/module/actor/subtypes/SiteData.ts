import type { TableResultDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/tableResultData'
import { ChallengeRankField } from '../../fields/ChallengeRankField'
import { ProgressTicksField } from '../../fields/ProgressTicksField'
import type { IronswornActor } from '../actor'
import type { SchemaToSourceData } from '../../fields/utils'
import { OracleTableResult } from '../../roll-table/oracle-table-result'
import SchemaField from '../../fields/types/SchemaField'
import { clone, omit } from 'lodash-es'
import { TableResultField } from '../../fields/TableResultField'

const denizenRanges: Array<[number, number]> = [
	[1, 27],
	[28, 41],
	[42, 55],
	[56, 69],
	[70, 75],
	[76, 81],
	[82, 87],
	[88, 93],
	[94, 95],
	[96, 97],
	[98, 99],
	[100, 100]
]

const denizenOptions: Array<Partial<TableResultField.Options>> =
	denizenRanges.map((staticRange) => ({ staticRange }))

export class SiteData extends foundry.abstract.DataModel<
	any,
	IronswornActor<'site'>
> {
	static _enableV10Validation = true

	protected override _initialize(...args) {
		super._initialize(...args)
		// brand denizens so that the originating delve site can be retrieved from message data
		for (const denizen of this.denizens) {
			setProperty(denizen, 'flags.foundry-ironsworn.sourceId', this.parent.id)
		}
	}

	get theme() {
		return this.parent.itemTypes['delve-theme'][0]
	}

	get domain() {
		return this.parent.itemTypes['delve-domain'][0]
	}

	static override defineSchema() {
		const fields = foundry.data.fields
		return {
			rank: new ChallengeRankField(),
			current: new ProgressTicksField(),
			objective: new fields.HTMLField(),
			description: new fields.HTMLField(),
			notes: new fields.HTMLField(),
			denizens: new fields.ArrayField(new TableResultField(), {
				initial: denizenOptions.map((item) => new TableResultField(item))
			})
		}
	}
}

export interface SiteData extends SchemaToSourceData<typeof SiteData> {
	denizens: TableResultDataConstructorData[]
}

export interface SiteDataSource {
	type: 'site'
	/**
	 * @deprecated
	 */
	data: SiteData
	system: SiteData
}
export interface SiteDataProperties {
	type: 'site'
	/**
	 * @deprecated
	 */
	data: InstanceType<typeof SiteData>
	system: InstanceType<typeof SiteData>
}
