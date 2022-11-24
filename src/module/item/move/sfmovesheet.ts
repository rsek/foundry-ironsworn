import sfmoveSheetVue from '../../vue/sfmove-sheet.vue'
import { VueAppRenderHelperOptions } from '../../vue/vue-render-helper'
import { VueItemSheet } from '../../vue/vueitemsheet'

export class SFMoveSheet extends VueItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: 'systems/foundry-ironsworn/templates/item/sfmove.hbs',
      height: 650,
    })
  }

  get renderHelperOptions(): Partial<VueAppRenderHelperOptions> {
    return {
      components: { 'sfmove-sheet': sfmoveSheetVue },
    }
  }
}
