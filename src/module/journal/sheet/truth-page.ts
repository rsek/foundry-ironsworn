import { IronswornHandlebarsHelpers } from '../../helpers/handlebars'

export class TruthJournalPageSheet extends foundry.appv1.sheets.JournalPageSheet {
	// @ts-expect-error
	isEditable: boolean

	get template() {
		return `systems/foundry-ironsworn/templates/journal/page-truth-${
			this.isEditable ? 'edit' : 'view'
		}.hbs`
	}

	async getData(
		options?: Partial<JournalPageSheet.Options> | undefined
	): Promise<JournalPageSheet.Data<JournalPageSheet.Options>> {
		const ret: any = await super.getData(options)
		ret.renderedDescription = await IronswornHandlebarsHelpers.enrichMarkdown(
			ret.data.system.Description
		)
		return ret
	}
}
