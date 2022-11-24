import sfLocationsheetVue from '../../vue/sf-locationsheet.vue'
import { VueAppRenderHelperOptions } from '../../vue/vue-render-helper'
import { VueActorSheet } from '../../vue/vueactorsheet'

export class StarforgedLocationSheet extends VueActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: 'systems/foundry-ironsworn/templates/actor/sf-location.hbs',
      width: 600,
      height: 600,
    })
  }

  get renderHelperOptions(): Partial<VueAppRenderHelperOptions> {
    return {
      components: { 'sf-locationsheet': sfLocationsheetVue },
    }
  }
}
