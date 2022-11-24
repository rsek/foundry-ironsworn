import progressSheetVue from '../../vue/progress-sheet.vue'
import { VueAppRenderHelperOptions } from '../../vue/vue-render-helper'
import { VueItemSheet } from '../../vue/vueitemsheet'

export class ProgressSheetV2 extends VueItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: 'systems/foundry-ironsworn/templates/item/progressv2.hbs',
      height: 550,
    })
  }

  get renderHelperOptions(): Partial<VueAppRenderHelperOptions> {
    return {
      components: { 'progress-sheet': progressSheetVue },
    }
  }

  get hasEditMode(): boolean {
    return false
  }
}
