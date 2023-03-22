import { compact } from 'lodash-es'
import { getDFMoveByDfId, getFoundryTableByDfId } from '../dataforged'
import type { IronswornItem } from '../item/item'

export async function createSfMoveChatMessage(move: IronswornItem<'sfmove'>) {
	const { dfid, Oracles } = move.system
	const dfMove = await getDFMoveByDfId(dfid)
	const dfIds = Oracles ?? dfMove?.Oracles ?? []
	const nextOracles = compact(
		await Promise.all(dfIds.map(getFoundryTableByDfId))
	)

	const params = { move, nextOracles }
	const content = await renderTemplate(
		'systems/foundry-ironsworn/templates/chat/sf-move.hbs',
		params
	)
	await ChatMessage.create({
		speaker: ChatMessage.getSpeaker(),
		content
	})
}
