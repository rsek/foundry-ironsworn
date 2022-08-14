import { marked } from 'marked'
import type { Plugin } from 'vue'
import { capitalize } from 'vue'
import { $EnrichHtmlKey, $EnrichMarkdownKey } from './provisions'
import type i18nData from '../../../system/lang/en.json'
import type { ValidLeafPaths } from '../../types/ValidPaths'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: (string: ValidLeafPaths<typeof i18nData>) => string
    $capitalize: (string: string) => string
    $concat: (...args: string[]) => string
    $enrichMarkdown: (string: string) => string
    $enrichHtml: (string: string) => string
  }
}

export function enrichHtml(text) {
  const rendered = TextEditor.enrichHTML(text)
  const rollText = game.i18n.localize('IRONSWORN.Roll')
  return rendered.replace(
    /\(\(rollplus (.*?)\)\)/g,
    (_, stat) => `
  <a class="inline-roll" data-param="${stat}">
    <i class="fas fa-dice-d6"></i>
    ${rollText} +${game.i18n
      .localize(`IRONSWORN.${capitalize(stat)}`)
      .toLowerCase()}
  </a>
`
  )
}

export function enrichMarkdown(md: string): string {
  const html = marked.parse(md)
  return enrichHtml(html)
}

export const IronswornVuePlugin: Plugin = {
  install(app, ..._options) {
    app.config.globalProperties.$t = (k) => game.i18n.localize(k)
    app.config.globalProperties.$concat = (...args) => args.join('')
    app.config.globalProperties.$capitalize = function (txt) {
      const [first, ...rest] = txt
      return `${first.toUpperCase()}${rest.join('')}`
    }
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
          if (item) return item
        }
        return game.items?.get(this.item._id)
      },
    })

    Object.defineProperty(app.config.globalProperties, '$actor', {
      get: function () {
        return game.actors?.get(this.actor?._id)
      },
    })
  },
}
