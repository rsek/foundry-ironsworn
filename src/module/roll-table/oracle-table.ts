import type { RollTableDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/rollTableData'
import type { ConfiguredFlags } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import type { IOracle, IOracleCategory, IRow } from 'dataforged'
import { max, pick } from 'lodash-es'
import { marked } from 'marked'
import type { IronswornActor } from '../actor/actor'
import { hashLookup, renderLinksInStr } from '../dataforged'
import { ISOracleCategories, SFOracleCategories } from '../dataforged/data'
import {
	findPathToNodeByTableUuid,
	getOracleTreeWithCustomOracles
} from '../features/customoracles'
import type { IronswornJournalEntry } from '../journal/journal-entry'
import type { IronswornJournalPage } from '../journal/journal-entry-page'

import { OracleTableResult } from './oracle-table-result'
import type { ComputedTableType, IOracleLeaf } from './roll-table-types'
import { Oracles } from './oracles'

/** Extends FVTT's default RollTable with functionality specific to this system. */
export class OracleTable extends RollTable {
	// missing from the LoFD types package
	declare description: string

	// static override async _onCreateDocuments(
	// 	documents: OracleTable[],
	// 	context: DocumentModificationContext
	// ) {
	// 	const oraclePacks = PACKS.filter((pack) => pack.includes('oracles'))

	// 	if (oraclePacks.includes(context.pack as ValueOf<typeof PACKS>)) {
	//     let foldersToCreate = []
	// 		for (const oracle of documents) {
	// 			if (oracle.dfid == null) continue
	// 			let parent = game.folders?.find(
	// 				(folder) => folder.dfid === oracle.parentDfid
	// 			)
	//       if (parent == null) {

	//       }
	// 		}
	// 	}

	// 	await super._onCreateDocuments(documents, context)
	// }

	override get visible() {
		const flg = this.getFlag('foundry-ironsworn', 'visible')
		if (typeof flg === 'boolean') return flg
		return super.visible
	}

	static DEFAULT_ICON = 'icons/dice/d10black.svg'

	/** The custom template used for rendering oracle results */
	static resultTemplate =
		'systems/foundry-ironsworn/templates/rolls/oracle-roll-message.hbs'

	static getDFOracleByDfId(
		dfid: string
	): IOracle | IOracleCategory | undefined {
		const nodes = OracleTable.findOracleWithIntermediateNodes(dfid)
		return nodes[nodes.length - 1]
	}

	static findOracleWithIntermediateNodes(
		dfid: string
	): Array<IOracle | IOracleCategory> {
		const ret: Array<IOracle | IOracleCategory> = []

		function walkCategory(cat: IOracleCategory): boolean {
			ret.push(cat)

			if (cat.$id === dfid) return true
			for (const oracle of cat.Oracles ?? []) {
				if (walkOracle(oracle)) return true
			}
			for (const childCat of cat.Categories ?? []) {
				if (walkCategory(childCat)) return true
			}

			ret.pop()
			return false
		}

		function walkOracle(oracle: IOracle): boolean {
			ret.push(oracle)

			if (oracle.$id === dfid) return true
			for (const childOracle of oracle.Oracles ?? []) {
				if (walkOracle(childOracle)) return true
			}

			ret.pop()
			return false
		}

		for (const cat of [...SFOracleCategories, ...ISOracleCategories]) {
			walkCategory(cat)
		}
		return ret
	}

	/**
	 * "Ask the Oracle": Retrieve one or more oracle tables and immediately rolls on them.
	 *
	 * @param ids A table ID, a table UUID, or Dataforged ID. Alternatively, an array of IDs may be provided, and each will be rolled.
	 * @param options Options to configure the `RollTable#draw` method.
	 * @see https://foundryvtt.com/api/classes/client.RollTable.html#draw
	 */
	static async ask(ids: string | string[], options?: RollTable.DrawOptions) {
		if (typeof ids === 'string') ids = [ids]
		const draws: RollTableDraw[] = []

		for await (const id of ids) {
			let oracleTable: OracleTable | undefined
			switch (true) {
				case /^(Ironsworn|Starforged)\/Oracles\//.test(id): // A Dataforged ID
					oracleTable = Oracles.findDfId(id)
					break
				case game.tables?.has(id): // A table ID
					oracleTable = game.tables?.get(id)
					break
				case /^(RollTable|Compendium)\./.test(id): // A UUID
					oracleTable = fromUuidSync(id) as OracleTable | undefined
					break
			}
			if (oracleTable instanceof OracleTable) {
				draws.push(await oracleTable.draw(options))
			} else {
				logger.warn(`Couldn't find an oracle for ID: ${id}`)
				continue
			}
		}
		return draws
	}

	/**
	 * @returns a string representing the path this table in the Ironsworn oracle tree (not including this table) */
	async getDfPath() {
		const starforgedRoot = await getOracleTreeWithCustomOracles('starforged')
		const ironswornRoot = await getOracleTreeWithCustomOracles('ironsworn')

		const pathElements =
			findPathToNodeByTableUuid(starforgedRoot, this.uuid) ??
			findPathToNodeByTableUuid(ironswornRoot, this.uuid)

		const pathNames = pathElements.map((x) => x.displayName)
		// root node (0) has no display name
		pathNames.shift()
		// last node is *this* node
		pathNames.pop()

		return pathNames.join(' / ')
	}

	/** Transforms a Dataforged IOracle table into RollTable constructor data. */
	static getConstructorData(
		oracle: OracleTable.IOracleLeaf
	): RollTableDataConstructorData {
		const description = marked.parseInline(
			renderLinksInStr(oracle.Description ?? '')
		)
		const maxRoll = max(oracle.Table.map((x) => x.Ceiling ?? 0))
		const data: RollTableDataConstructorData = {
			_id: hashLookup(oracle.$id),
			flags: {
				dataforged: pick(oracle, '$id', 'Source', 'Category', 'Display')
			},
			name: oracle.Name,
			// strip "Oracle XX: " from some ironsworn titles
			// name: oracle.Display.Title.replace(/^Oracle [0-9+]: /, ''),
			sort: oracle.Source.Page,
			description,
			formula: `d${maxRoll as number}`,
			replacement: true,
			displayRoll: true,
			results: oracle.Table?.filter((x) => x.Floor !== null).map((tableRow) =>
				OracleTableResult.getConstructorData(
					tableRow as IRow & { Floor: number; Ceiling: number }
				)
			)
		}
		return data
	}

	/**
	 * Initialize one or more instances of OracleTable from a Dataforged {@link IOracle} node.
	 * @param options Default constructor options for the tables.
	 * @param context Default constructor context for the tables
	 */
	static async fromDataforged(
		tableData: OracleTable.IOracleLeaf,
		options?: Partial<RollTableDataConstructorData>,
		context?: DocumentModificationContext
	): Promise<OracleTable | undefined>
	static async fromDataforged(
		tableData: OracleTable.IOracleLeaf[],
		options?: Partial<RollTableDataConstructorData>,
		context?: DocumentModificationContext
	): Promise<OracleTable[]>
	static async fromDataforged(
		tableData: OracleTable.IOracleLeaf | OracleTable.IOracleLeaf[],
		options: Partial<RollTableDataConstructorData> = {},
		context: DocumentModificationContext = {}
	): Promise<OracleTable | OracleTable[] | undefined> {
		const clonedOptions = deepClone(options)

		if (!Array.isArray(tableData)) {
			logger.info(`Building ${tableData.$id}`)
			return await OracleTable.create(
				mergeObject(clonedOptions, OracleTable.getConstructorData(tableData), {
					overwrite: false,
					inplace: false
				}) as RollTableDataConstructorData,
				context
			)
		}
		logger.info(`Building ${tableData.map((item) => item.$id).join(', ')}`)
		return await OracleTable.createDocuments(
			tableData.map(
				(table) =>
					mergeObject(
						deepClone(clonedOptions),
						OracleTable.getConstructorData(table),
						{
							overwrite: false,
							inplace: false
						}
					) as RollTableDataConstructorData
			),
			context
		)
	}

	/**
	 * Prepares handlebars template data for an oracle roll message.
	 * @remarks This is provided as its own method so that it can be reused to 'fake' rerolls in OracleTable#reroll
	 */
	async _prepareTemplateData(results: OracleTableResult[], roll: null | Roll) {
		const result = results[0]
		return {
			// NB: with these options, this is async in v10
			// eslint-disable-next-line @typescript-eslint/await-thenable
			description: await TextEditor.enrichHTML(this.description, {
				documents: true,
				// @ts-expect-error exists in v10
				async: true
			}),
			result: mergeObject(result.toObject(false), {
				text: result.getChatText(),
				icon: result.icon,
				displayRows: result.displayRows.map((row) => row?.toObject())
			}),
			roll: roll?.toJSON(),
			table: this,
			subtitle:
				this.getFlag('foundry-ironsworn', 'subtitle') ??
				(await this.getDfPath()),
			rollTableType: this.getFlag('foundry-ironsworn', 'type'),
			sourceId: this.getFlag('foundry-ironsworn', 'sourceId')
		}
	}

	/** Retrieve the originating document of a computed OracleTable.  */
	getSourceDocument() {
		const uuid = this.getFlag('foundry-ironsworn', 'sourceId')
		if (uuid == null) return undefined
		return fromUuidSync(uuid) as IronswornActor
	}

	override async toMessage(
		results: OracleTableResult[],
		{
			roll = null,
			messageData = {},
			messageOptions = {}
		}: DeepPartial<RollTable.ToMessageOptions> = {}
	) {
		const cls = getDocumentClass('ChatMessage')
		const rollTableType = this.getFlag('foundry-ironsworn', 'type')

		const speakerOptions: ChatMessage.GetSpeakerOptions = {}

		// intentionally left as a switch for later expansion
		switch (rollTableType) {
			case 'delve-site-dangers':
			case 'delve-site-denizens':
			case 'delve-site-features': // delve site oracles are attributed to the delve site
				speakerOptions.actor = this.getSourceDocument()
				break
			default:
				break
		}

		const speaker = cls.getSpeaker(speakerOptions)

		// options for this aren't exposed prior to running the method, so we have to rebuild them from scratch
		// these are loosely based on FVTT v10 RollTable#toMessage

		// TODO This is a fallback to handle tables that can produce multiple results from a single roll, which foundry-ironsworn doesn't presently use. There might be some utility to them doing so, however...
		if (
			results.length > 1 ||
			results.some((result) => !(result instanceof OracleTableResult))
		)
			return await super.toMessage(results, {
				roll,
				messageData,
				// @ts-expect-error
				messageOptions
			})

		const flags: ConfiguredFlags<'ChatMessage'> = {
			core: { RollTable: this.id },
			'foundry-ironsworn': {
				rollTableType: this.getFlag('foundry-ironsworn', 'type'),
				sourceId: this.getFlag('foundry-ironsworn', 'sourceId') ?? this.uuid
			}
		}

		// Construct chat data
		messageData = foundry.utils.mergeObject(
			{
				user: game.user?.id,
				speaker,
				type:
					roll != null
						? CONST.CHAT_MESSAGE_TYPES.ROLL
						: CONST.CHAT_MESSAGE_TYPES.OTHER,
				roll,
				sound: roll != null ? CONFIG.sounds.dice : null,
				flags
			},
			messageData
		)

		// console.log('messageData', messageData)

		const templateData = await this._prepareTemplateData(results, roll)

		// Render the chat card which combines the dice roll with the drawn results
		messageData.content = await renderTemplate(
			OracleTable.resultTemplate,
			templateData
		)

		// Create the chat message
		return await cls.create(messageData, messageOptions)
	}

	/**
	 * Retrieve a computed oracle table from its originating document. This allows rehydration of computed tables from e.g. chat message flags.
	 * @param sourceId The UUID of the original source of the computed table, usually an Actor or Item.
	 * @param type The expected type of the computed table
	 */
	static async getComputedTable(sourceId: string, type: ComputedTableType) {
		const source = await fromUuid(sourceId)
		if (source == null) return undefined
		let table: OracleTable | undefined
		switch (type) {
			case 'delve-site-dangers':
				table = (source as IronswornActor).dangers
				break
			case 'delve-site-denizens':
				table = (source as IronswornActor).denizens
				break
			case 'delve-site-features':
				table = (source as IronswornActor).features
				break
			case 'truth-options':
				table = (source as IronswornJournalEntry).truthTable
				break
			case 'truth-option-subtable':
				table = (source as IronswornJournalPage).subtable
				break
			default:
				break
		}
		return table
	}

	/**
	 * Rerolls an oracle result message, replacing the message content with the new result
	 */
	static async reroll(messageId: string) {
		const msg = game.messages?.get(messageId)
		if (msg == null) return

		const rerolls = msg.getFlag('foundry-ironsworn', 'rerolls') ?? []
		const sourceId = msg.getFlag('foundry-ironsworn', 'sourceId')
		const rollTableType = msg.getFlag('foundry-ironsworn', 'rollTableType')

		// console.log(rerolls, sourceId, rollTableType)

		if (sourceId == null) return
		let oracleTable: OracleTable | undefined
		if (rollTableType == null)
			oracleTable = (await fromUuid(sourceId)) as OracleTable | undefined
		else {
			oracleTable = await OracleTable.getComputedTable(sourceId, rollTableType)
		}
		if (oracleTable == null) return

		// defer render to chat so we can manually set the chat message id
		const { results, roll } = await oracleTable.draw({ displayChat: false })

		const templateData = await oracleTable._prepareTemplateData(results, roll)

		const flags = foundry.utils.mergeObject(msg.toObject().flags, {
			'foundry-ironsworn': {
				rerolls: [...rerolls, roll.total]
			}
		}) as ConfiguredFlags<'ChatMessage'>

		// trigger sound + 3d dice manually because updating the message won't
		if (game.dice3d) void game.dice3d.showForRoll(roll, game.user, true)
		else void AudioHelper.play({ src: CONFIG.sounds.dice })

		return await msg.update({
			content: await renderTemplate(OracleTable.resultTemplate, templateData),
			flags
		})
	}
}

export namespace OracleTable {
	export type IOracleLeaf = IOracle & { Table: IRow[] }
}
