import { marked } from 'marked'
import type { Plugin } from 'vue'
import { capitalize } from '../helpers/util'
import { formatRollPlusStat } from '../rolls/ironsworn-roll-message.js'
import { $EnrichHtmlKey, $EnrichMarkdownKey } from './provisions'

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		/**
		 * Without a `data` parameter: shortcut for {@link game.i18n.localize}.
		 * With a `data` parameter: shortcut for {@link game.i18n.format}.
		 */
		$t: (...args: Parameters<typeof game.i18n.format>) => string
		$capitalize: (string) => string
		$concat: (...args: any[]) => string
		$enrichMarkdown: (string) => string
		$enrichHtml: (string) => string
	}
}

export function enrichHtml(text) {
	const rendered = TextEditor.enrichHTML(text, { async: false })
	return rendered.replace(
		/\(\(rollplus (.*?)\)\)/g,
		(_, stat: string) => `
  <a class="inline-roll" data-param="${stat}">
    <i class="fas fa-dice-d6"></i>
    ${formatRollPlusStat(stat)}
  </a>
`
	)
}

export function enrichMarkdown(md?: string): string {
	if (!md) return ''
	const html = marked.parse(md)
	return enrichHtml(html)
}

export const IronswornVuePlugin: Plugin = {
	install(app, ..._options) {
		app.config.globalProperties.$t = (
			stringId: string,
			data?: Record<string, string | number | boolean | null>
		) =>
			data != null
				? game.i18n.format(stringId, data)
				: game.i18n.localize(stringId)
		app.config.globalProperties.$concat = (...args) => args.join('')
		app.config.globalProperties.$capitalize = capitalize
		app.config.globalProperties.$enrichHtml = enrichHtml
		app.provide($EnrichHtmlKey, enrichHtml)

		app.config.globalProperties.$enrichMarkdown = enrichMarkdown
		app.provide($EnrichMarkdownKey, enrichMarkdown)

		Object.defineProperty(app.config.globalProperties, '$item', {
			get: function () {
				const actorId = this.item?.parent?._id ?? this.actor?._id
				if (actorId) {
					const actor = game.actors?.get(actorId)
					const item = actor?.items.get(this.item._id)
					if (item != null) return item
				}
				return game.items?.get(this.item._id)
			}
		})

		Object.defineProperty(app.config.globalProperties, '$actor', {
			get: function () {
				return game.actors?.get(this.actor?._id)
			}
		})
	}
}
