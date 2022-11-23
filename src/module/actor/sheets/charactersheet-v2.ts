import { IronswornSettings } from '../../helpers/settings'
import characterSheetVue from '../../vue/character-sheet.vue'
import { VueSheetRenderHelperOptions } from '../../vue/vue-render-helper'
import { VueActorSheet } from '../../vue/vueactorsheet'
import { OracleMoveBrowserSheet } from './oracle-move-browser-sheet'

export class IronswornCharacterSheetV2 extends VueActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: 'systems/foundry-ironsworn/templates/actor/character-v2.hbs',
      width: 700,
      height: 800,
      left: 50,
    })
  }

  get renderHelperOptions(): Partial<VueSheetRenderHelperOptions> {
    return {
      components: { 'character-sheet': characterSheetVue },
    }
  }

  render(...args) {
    if (this._state <= Application.RENDER_STATES.NONE) this._openMoveSheet()
    return super.render(...args)
  }

  _getHeaderButtons() {
    return [
      {
        class: 'ironsworn-open-move-sheet',
        label: game.i18n.localize('IRONSWORN.Moves'),
        icon: 'fas fa-directions',
        onclick: (e) => this._openMoveSheet(e),
      },
      ...super._getHeaderButtons(),
    ]
  }

  _openMoveSheet(_e?: JQuery.ClickEvent) {
    if (!this.actor.browserSheet) {
      this.actor.browserSheet ||= new OracleMoveBrowserSheet(
        this.actor,
        IronswornSettings.get('toolbox') === 'starforged'
          ? 'starforged'
          : 'ironsworn',
        { left: 755 }
      )
    }
    this.actor.browserSheet.render(true, { focus: true })
  }
}
