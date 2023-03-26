import { IronswornJournalPage } from './journal-entry-page'

export class TruthJournalPageSheet extends JournalPageSheet<
	IronswornJournalPage<'truth'>
> {
	// @ts-expect-error
	isEditable: boolean

	get template() {
		return `systems/foundry-ironsworn/templates/journal/page-truth-${
			this.isEditable ? 'edit' : 'view'
		}.hbs`
	}
}
