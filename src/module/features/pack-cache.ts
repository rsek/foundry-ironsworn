import type { IronswornActor } from '../actor/actor'
import type { IronswornItem } from '../item/item'

const ONE_MINUTE_IN_MS = 60 * 1000

type PackContents<K extends PackName = PackName> = Array<PackMap[K]>

export type PackName = keyof PackMap

interface PackMap {
	'foundry-ironsworn.foeactorsis': IronswornActor
	'foundry-ironsworn.foeactorssf': IronswornActor
	'foundry-ironsworn.ironswornoracles': RollTable
	'foundry-ironsworn.ironswornmoves': IronswornItem
	'foundry-ironsworn.ironswornassets': IronswornItem
	'foundry-ironsworn.ironsworndelvethemes': IronswornItem
	'foundry-ironsworn.ironsworndelvedomains': IronswornItem
	'foundry-ironsworn.ironswornfoes': IronswornItem
	'foundry-ironsworn.ironswornscenes': Scene
	'foundry-ironsworn.starforged-sectors': Scene
	'foundry-ironsworn.starforgedassets': IronswornItem
	'foundry-ironsworn.starforgedencounters': IronswornItem
	'foundry-ironsworn.starforgedmoves': IronswornItem
	'foundry-ironsworn.starforgedoracles': RollTable
	'foundry-ironsworn.starforgedtruths': JournalEntry
	'foundry-ironsworn.macros': Macro
}

const PACK_CACHE = {} as Record<PackName, PackContents | undefined>

async function populateCacheForPack<T extends PackName>(packName: T) {
	console.log(`Loading documents for pack ${packName}`)
	const pack = game.packs.get(packName)
	PACK_CACHE[packName] = (await pack?.getDocuments()) as PackContents<T>
}

export async function cachedDocumentsForPack<T extends PackName>(packName: T) {
	if (PACK_CACHE[packName] == null) {
		await populateCacheForPack(packName)
	}
	return PACK_CACHE[packName]
}

export async function primeCommonPackCaches() {
	const commonPackNames: PackName[] = [
		'foundry-ironsworn.starforgedoracles',
		'foundry-ironsworn.starforgedmoves',
		'foundry-ironsworn.ironswornoracles'
	]
	await Promise.all(commonPackNames.map(cachedDocumentsForPack))

	// Keep the cache from being garbage collected by refreshing it every so often
	let i = 0
	while (true) {
		await new Promise((r) => setTimeout(r, ONE_MINUTE_IN_MS))
		await populateCacheForPack(commonPackNames[i % commonPackNames.length])
		i++
	}
}
