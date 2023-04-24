import type {
	TableResultDataConstructorData,
	TableResultDataProperties,
	TableResultDataSource
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/tableResultData'
import type { IRow, RequireKey } from 'dataforged'
import { inRange } from 'lodash-es'
import type { helpers } from '../../types/utils'
import { hashLookup, pickDataforged, renderLinksInStr } from '../dataforged'
import { OracleTree } from './oracle-tree'
import { CompendiumCollection } from '../compendium/compendium'

/** Extends FVTT's default TableResult with functionality specific to this system. */
export class OracleTableResult extends TableResult {
	/** Does the number value fall within the range of this TableResult? */
	hasInRange(value: number) {
		const [low, high] = this.range
		return inRange(value, low, high + 1)
	}

	/**
	 * Returns the table rows immediately above and below this row.
	 * @return A tuple of the previous row (if it exists) and the next row (if it exists).
	 * @remarks Doesn't take into account overlapping ranges because 1) it's complicated and 2) none of our tables utilize that (currently).
	 */
	get adjacentRows(): [
		OracleTableResult | undefined,
		OracleTableResult | undefined
	] {
		const prev = this.collection.find(
			(result) => result.range[1] === this.range[0] - 1
		)
		const next = this.collection.find(
			(result) => result.range[0] === this.range[1] + 1
		)
		return [prev, next]
	}

	/**
	 * Convenience getter that returns the adjacent rows *plus* this row in an ordered tuple.
	 * @return A ordered tuple containing the previous result, the current result, and the next result,
	 */
	get displayRows(): [
		OracleTableResult | undefined,
		this,
		OracleTableResult | undefined
	] {
		const [prev, next] = this.adjacentRows
		return [prev, this, next]
	}

	// TODO: TableResult#getChatText might be a better way to manage summary text as a separate field in flags (distinct from the primary text)

	/** Converts a Dataforged IRow object into OracleTableResult constructor data. */
	static getConstructorData(
		tableRow: OracleTableResult.IRollableRow
	): TableResultDataConstructorData {
		let text: string
		if (tableRow.Result && tableRow.Summary) {
			text = `${tableRow.Result} (${tableRow.Summary})`
		} else text = tableRow.Result ?? ''

		const data: TableResultDataConstructorData = {
			range: [tableRow.Floor, tableRow.Ceiling],
			text: tableRow.Result && renderLinksInStr(text),
			flags: {
				'foundry-ironsworn': {
					dfid: tableRow.$id ?? undefined
				}
			}
		}

		const dataforged = pickDataforged(
			tableRow,
			'Attributes',
			'Suggestions',
			'Oracle rolls',
			'Game objects'
		)
		// TODO: extract color + icon from IRow.Display
		if (
			Object.keys(dataforged).length > 0 &&
			data.flags?.['foundry-ironsworn'] != null
		)
			data.flags['foundry-ironsworn'].dataforged = dataforged

		const rawId =
			tableRow.dfid ??
			(tableRow as any).system?.dfid ??
			(tableRow as any).flags?.['foundry-ironsworn']?.dfid ??
			tableRow.$id

		if (rawId != null) data._id = hashLookup(rawId)

		return data
	}

	/** Does the row data have a numeric range? */
	static isRollableRow(row: IRow): row is OracleTableResult.IRollableRow {
		return typeof row.Floor === 'number' && typeof row.Ceiling === 'number'
	}

	static isEmbeddedRow(row: IRow): row is OracleTableResult.IEmbeddedRow {
		return typeof (row as OracleTableResult.IEmbeddedRow)?.dfid === 'string'
	}

	/**
	 * Initialize one or more instances of OracleTable from Dataforged's data.
	 * @param options Default constructor options for the tables.
	 * @param context Default constructor context for the tables
	 */
	static async fromDataforged(
		rowData: OracleTableResult.IRollableRow,
		options?: Partial<TableResultDataConstructorData>,
		context?: DocumentModificationContext
	): Promise<OracleTableResult | undefined>
	static async fromDataforged(
		rowData: OracleTableResult.IRollableRow[],
		options?: Partial<TableResultDataConstructorData>,
		context?: DocumentModificationContext
	): Promise<OracleTableResult[]>
	static async fromDataforged(
		rowData: OracleTableResult.IRollableRow | OracleTableResult.IRollableRow[],
		options: Partial<TableResultDataConstructorData> = {},
		context: DocumentModificationContext = {}
	): Promise<OracleTableResult | OracleTableResult[] | undefined> {
		if (!Array.isArray(rowData)) {
			return await OracleTableResult.create(
				mergeObject(
					options,
					OracleTableResult.getConstructorData(rowData)
				) as TableResultDataConstructorData,
				context
			)
		}
		return await OracleTableResult.createDocuments(
			rowData.map(
				(row) =>
					mergeObject(
						options,
						OracleTableResult.getConstructorData(row)
					) as TableResultDataConstructorData
			),
			context
		)
	}

	override toCompendium(
		...[pack, options]: Parameters<TableResult['toCompendium']>
	) {
		let data = super.toCompendium(
			pack,
			options
		) as TableResultDataConstructorData

		if (options == null) return data

		// Patch: FVTT v10 doesn't properly clear the ownership flag when clearPermissions is set.
		if (options.clearOwnership ?? options.clearPermissions ?? false) {
			delete (data as any).ownership
		}
		if (options.clearState) {
			delete data.drawn
		}
		const canonicalPacks = Object.values(OracleTree.CANONICAL_PACKS).flat()

		if (canonicalPacks.includes(pack?.collection as any)) {
			// strip a bunch of keys that don't add meaningful data in our use case
			// const keysToStrip: (keyof OracleTableResult)[] = [
			// 	'type', // defaults to 0
			// 	'img',
			// 	'documentCollection',
			// 	'documentId',
			// 	'weight'
			// ]

			data = CompendiumCollection.stripOptionalKeys(this.schema, data)
		}
		return data as any
	}
}

export namespace OracleTableResult {
	export type IEmbeddedRow = IRow & { dfid: string }
	export type IRollableRow = RequireKey<IRow, 'Floor' | 'Ceiling'> & {
		dfid?: string
	}
}
