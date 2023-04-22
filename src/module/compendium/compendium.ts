import type { DocumentClassForCompendiumMetadata } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/data/collections/compendium'

export namespace CompendiumCollection {
	export const CANONICAL_PACKS = {
		Actor: ['foundry-ironsworn.foeactorssf', 'foundry-ironsworn.foeactorsis'],
		Item: [
			'foundry-ironsworn.starforgedassets',
			'foundry-ironsworn.ironswornassets',
			'foundry-ironsworn.starforgedmoves',
			'foundry-ironsworn.ironswornmoves',
			'foundry-ironsworn.starforgedencounters',
			'foundry-ironsworn.ironswornfoes',
			'foundry-ironsworn.ironsworndelvethemes',
			'foundry-ironsworn.ironsworndelvedomains'
		],
		RollTable: [
			'foundry-ironsworn.starforgedoracles',
			'foundry-ironsworn.ironswornoracles'
		],
		JournalEntry: [
			'foundry-ironsworn.starforgedtruths',
			'foundry-ironsworn.ironsworntruths'
		]
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

	export function hasDfId(dfid: string) {
		throw new Error('NYI')
	}
}
