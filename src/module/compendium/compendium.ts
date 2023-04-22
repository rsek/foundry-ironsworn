import type { DocumentClassForCompendiumMetadata } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/data/collections/compendium'

export class IronCompendiumCollection<
	T extends CompendiumCollection.Metadata
> extends CompendiumCollection<T> {
	static readonly CANONICAL_PACKS = {
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

	get canonical() {
		return IronCompendiumCollection.CANONICAL_PACKS[
			this.documentName as any
		]?.includes(this.collection as any)
	}

	hasDfId(dfid: string) {
		throw new Error('NYI')
	}

	empty() {
		for (const item of this) {
			this.index.delete(item.id)
			this.delete(item.id)
		}
	}
}

// could the compendium get some flags that marks it for use as tree data?
// for example, keeping: a list of all folders?
