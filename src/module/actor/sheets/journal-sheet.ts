import HbsLoader from '../../vue/components/hbs-loader.vue'
import { VueSheetRenderHelperOptions } from '../../vue/vue-render-helper'
import { VueAppMixin } from '../../vue/vueapp'
import { VueItemSheet } from '../../vue/vueitemsheet'

export class IronswornJournalSheet extends VueAppMixin(JournalSheet) {
  static get defaultOptons() {
    return mergeObject(super.defaultOptions, {
      template: 'systems/foundry-ironsworn/templates/journal/journal.hbs',
      classes: ['hbs-loader', ...super.defaultOptions.classes],
    })
  }
  get renderHelperOptions(): Partial<VueSheetRenderHelperOptions> {
    return {
      components: { 'hbs-loader': HbsLoader },
      vueData: async () => ({
        path: JournalSheet.defaultOptions.template,
        data: {},
      }),
    }
  }
}
