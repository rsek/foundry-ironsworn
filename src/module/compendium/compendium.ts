import type { AnyDocumentData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/data.mjs'
import { isFunction } from 'lodash-es'
import type { helpers } from '../../types/utils'

export namespace CompendiumCollection {
	export const CANONICAL_PACKS = {
		Actor: {
			Ironsworn: ['foundry-ironsworn.foeactorsis'],
			Starforged: ['foundry-ironsworn.foeactorssf']
		},
		RollTable: {
			Ironsworn: ['foundry-ironsworn.ironswornoracles'],
			Starforged: ['foundry-ironsworn.starforgedoracles']
		},
		Item: {
			Ironsworn: [
				'foundry-ironsworn.ironswornassets',
				'foundry-ironsworn.ironswornmoves',
				'foundry-ironsworn.ironswornfoes',
				'foundry-ironsworn.ironsworndelvethemes',
				'foundry-ironsworn.ironsworndelvedomains'
			],
			Starforged: [
				'foundry-ironsworn.starforgedassets',
				'foundry-ironsworn.starforgedmoves',
				'foundry-ironsworn.starforgedencounters'
			]
		},
		JournalEntry: {
			Ironsworn: ['foundry-ironsworn.ironsworntruths'],
			Starforged: ['foundry-ironsworn.starforgedtruths']
		}
	} as const

	export function empty<T extends CompendiumCollection<any>>(pack: T) {
		for (const item of pack) {
			pack.index.delete(item.id)
			pack.delete(item.id)
		}
	}

	export function isCanonical<T extends CompendiumCollection<any>>(pack: T) {
		return Boolean(
			CANONICAL_PACKS[pack.documentName as any]?.includes(
				pack.collection as any
			)
		)
	}

	/** Strips optional and nullable keys that use `null` or the default value. */
	export function stripOptionalKeys<
		TDoc extends AnyDocumentData,
		TData extends helpers.ConstructorDataType<TDoc>
	>(
		schema: TDoc['schema'],
		data: TData,
		...keys: (keyof Expanded<TData>)[]
	): TData {
		const keysToStrip = [
			...keys,
			'ownership',
			'flags.foundry-ironsworn.canonical'
		]
		for (const [key, field] of Object.entries(schema.fields)) {
			const initial = isFunction(field?.initial)
				? field?.initial()
				: field?.initial
			const canDelete = !field?.required || field?.nullable

			// console.log('defaultValue', defaultValue)
			// console.log('canDelete', canDelete)

			if (canDelete && (initial === data[key] || data[key] === null))
				keysToStrip.push(key)
		}
		for (const key of keysToStrip) {
			setProperty(data as object, key, undefined)
		}

		// console.log('cleaned data', data)
		return data
	}
}
