import type { Hooks } from 'foundry-types/client/core/hooks'

export function registerCompendiumCategoryHook() {
	Hooks.on(
		'renderCompendium',
		async (app: Compendium<RollTable>, html, _opts) => {
			if (app.collection.documentName !== 'RollTable') return
			const collection = app.collection
			for (const el of html.find('.directory-item')) {
				const table = await collection.getDocument(
					el.dataset.documentId as string
				)
				if (table?.flags?.category) {
					const cat = table.flags.category
						.replace(/(Starforged|Ironsworn)\/Oracles\//, '')
						.replace(/_/g, ' ')
					$(el).append(
						`<small style="flex-grow: 0; white-space: nowrap">${cat}</small>`
					)
				}
			}
		}
	)
}
