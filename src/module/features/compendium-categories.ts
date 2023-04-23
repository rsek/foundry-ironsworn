import type { helpers } from '../../types/utils'
import type { OracleTable } from '../roll-table/oracle-table'

export function registerCompendiumCategoryHook() {
	Hooks.on('renderCompendium', async (_app, html: JQuery, opts) => {
		if (opts.documentCls !== 'rolltable') return

		const collection = opts.collection as CompendiumCollection<any>
		const index = await collection.getIndex()

		for (const el of html.find('.directory-item')) {
			const id = el.dataset.documentId as string

			const indexEntry = index.get(id) as Partial<
				helpers.SourceDataType<OracleTable>
			>
			const dfid = indexEntry.flags?.['foundry-ironsworn']?.dfid
			if (dfid != null) {
				const path = dfid
					.split('/')
					.slice(2, -1)
					.join(' / ')
					.replaceAll('_', ' ')

				$(el).append(
					`<small style="flex-grow: 0; white-space: nowrap" data-dfid="${dfid}">${path}</small>`
				)
			}
		}
	})
}
