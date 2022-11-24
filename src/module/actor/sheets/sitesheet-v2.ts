import { SiteDataSource } from '../actortypes'
import { VueActorSheet } from '../../vue/vueactorsheet'
import { VueAppRenderHelperOptions } from '../../vue/vue-render-helper'
import siteSheetVue from '../../vue/site-sheet.vue'

export class IronswornSiteSheetV2 extends VueActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: 'systems/foundry-ironsworn/templates/actor/site-v2.hbs',
      width: 700,
      height: 650,
      resizable: false,
    })
  }

  get renderHelperOptions(): Partial<VueAppRenderHelperOptions> {
    return {
      components: { 'site-sheet': siteSheetVue },
    }
  }

  get siteData() {
    return this.actor.data as SiteDataSource
  }

  async _onDropItem(event: DragEvent, data: ActorSheet.DropData.Item) {
    // Fetch the item. We only want to override denizens (progress-type items)
    const item = await Item.fromDropData(data)
    if (!item) return false
    if (item.type !== 'progress') {
      return super._onDropItem(event, data)
    }

    // Find which denizen slot this is going into
    const dropTarget = $(event.target as HTMLElement).parents(
      '.ironsworn__denizen__drop'
    )[0]
    if (!dropTarget) return false
    const idx = parseInt(dropTarget.dataset.idx || '')
    const { denizens } = this.siteData.data
    if (!denizens[idx]) return false

    // Set the denizen description
    const description = item.pack
      ? `@Compendium[${item.pack}.${item.id}]{${item.name}}`
      : item.link
    denizens[idx].description = description
    this.actor.update({ system: { denizens } }, { render: true })
    return true
  }
}
