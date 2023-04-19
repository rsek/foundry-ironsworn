import { compact } from 'lodash-es'
import { getDFMoveByDfId } from '../dataforged'
import type { IronswornItem } from '../item/item'
import type { SFMoveDataPropertiesData } from '../item/itemtypes'
import { Oracles } from '../roll-table/oracles'

export async function createSfMoveChatMessage(move: IronswornItem) {
	const { dfid, Oracles: oracleIds } = move.system as SFMoveDataPropertiesData
	const dfMove = await getDFMoveByDfId(dfid)
	const dfids = oracleIds ?? dfMove?.Oracles ?? []
	const nextOracles = compact(dfids.map((id) => Oracles.findDfId(id)))

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
