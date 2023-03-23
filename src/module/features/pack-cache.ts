import type { IronswornActor } from '../actor/actor'
import type { IronswornItem } from '../item/item'
import type { KeysMatching } from 'dataforged'

const ONE_MINUTE_IN_MS = 60 * 1000

/**
 * @template TContents The type of document contained in the pack.
 */
export type PackName<
	TContents extends PackTypeMap[keyof PackTypeMap] = PackTypeMap[keyof PackTypeMap]
> = KeysMatching<PackTypeMap, TContents>

interface PackTypeMap {
	'foundry-ironsworn.foeactorsis': IronswornActor<'foe'>
	'foundry-ironsworn.foeactorssf': IronswornActor<'foe'>
	'foundry-ironsworn.ironswornoracles': RollTable
	'foundry-ironsworn.ironswornmoves': IronswornItem<'sfmove'>
	'foundry-ironsworn.ironswornassets': IronswornItem<'asset'>
	'foundry-ironsworn.ironsworndelvethemes': IronswornItem<'delve-theme'>
	'foundry-ironsworn.ironsworndelvedomains': IronswornItem<'delve-domain'>
	'foundry-ironsworn.ironswornfoes': IronswornItem<'progress'>
	'foundry-ironsworn.ironswornscenes': Scene
	'foundry-ironsworn.starforged-sectors': Scene
	'foundry-ironsworn.starforgedassets': IronswornItem<'asset'>
	'foundry-ironsworn.starforgedencounters': IronswornItem<'progress'>
	'foundry-ironsworn.starforgedmoves': IronswornItem<'sfmove'>
	'foundry-ironsworn.starforgedoracles': RollTable
	'foundry-ironsworn.starforgedtruths': JournalEntry
	'foundry-ironsworn.macros': Macro
}
type PackCache = {
	[K in keyof PackTypeMap]?: Array<PackTypeMap[K]> | undefined
}

const PACK_CACHE: PackCache = {}

async function populateCacheForPack<T extends PackName>(packName: T) {
	console.log(`Loading documents for pack ${packName}`)
	const pack = game.packs.get<CompendiumCollection<PackTypeMap[T]>>(packName)
	PACK_CACHE[packName] = (await pack?.getDocuments()) as PackCache[T]
}

export async function cachedDocumentsForPack<T extends PackName>(packName: T) {
	if (PACK_CACHE[packName] == null) {
		await populateCacheForPack(packName)
	}
	return PACK_CACHE[packName]
}

export async function primeCommonPackCaches() {
	const commonPackNames: Array<PackName<IronswornItem<'sfmove'> | RollTable>> =
		[
			'foundry-ironsworn.starforgedoracles',
			'foundry-ironsworn.starforgedmoves',
			'foundry-ironsworn.ironswornoracles'
		]
	await Promise.all(commonPackNames.map(cachedDocumentsForPack))

	// Keep the cache from being garbage collected by refreshing it every so often
	let i = 0
	while (true) {
		await new Promise((_resolve) => setTimeout(_resolve, ONE_MINUTE_IN_MS))
		await populateCacheForPack(commonPackNames[i % commonPackNames.length])
		i++
	}
}
