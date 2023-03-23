import type { IronswornActor } from '../actor/actor'
import type { IronswornItem } from '../item/item'

interface ActorsAndAssets {
	actors: Array<IronswornActor<'character' | 'starship'>>
	assets: Array<IronswornItem<'asset'>>
}

export function actorsOrAssetsWithConditionEnabled(
	condition: string
): ActorsAndAssets {
	const ret: ActorsAndAssets = { actors: [], assets: [] }

	for (const actor of game.actors?.contents ?? []) {
		const actorData = actor.system as any
		if (actorData.debility?.[condition]) {
			ret.actors.push(actor as IronswornActor<'character' | 'starship'>)
		}

		for (const item of actor.itemTypes.asset) {
			if (
				item.system.conditions.find(
					(c) => c.name.toLowerCase() === condition.toLowerCase() && c.ticked
				) != null
			) {
				ret.assets.push(item)
			}
		}
	}

	return ret
}
