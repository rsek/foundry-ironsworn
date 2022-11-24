import starshipSheetVue from '../../vue/starship-sheet.vue'
import { VueAppRenderHelperOptions } from '../../vue/vue-render-helper'
import { VueActorSheet } from '../../vue/vueactorsheet'

export class StarshipSheet extends VueActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: 'systems/foundry-ironsworn/templates/actor/starship.hbs',
      width: 500,
      height: 500,
    })
  }

  get renderHelperOptions(): Partial<VueAppRenderHelperOptions> {
    return {
      components: { 'starship-sheet': starshipSheetVue },
    }
  }
}
