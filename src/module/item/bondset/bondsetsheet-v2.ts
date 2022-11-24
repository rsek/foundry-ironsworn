import bondsetSheetVue from '../../vue/bondset-sheet.vue'
import { VueAppRenderHelperOptions } from '../../vue/vue-render-helper'
import { VueItemSheet } from '../../vue/vueitemsheet'

export class BondsetSheetV2 extends VueItemSheet {
  get template() {
    return 'systems/foundry-ironsworn/templates/item/bondsetv2.hbs'
  }

  get renderHelperOptions(): Partial<VueAppRenderHelperOptions> {
    return {
      components: { 'bondset-sheet': bondsetSheetVue },
    }
  }
}
