import { VueSheetRenderHelperOptions } from '../../../vue/vue-render-helper'
import { VueAppMixin } from '../../../vue/vueapp'
import HbsLoader from '../../vue/components/hbs-loader.vue'
export class IronswornJournalSheet extends VueAppMixin(JournalSheet) {
  static override get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: 'systems/foundry-ironsworn/templates/journal/sheet.hbs',
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
