import { Starforged, starforged } from 'dataforged'
import sfTruthsVue from '../vue/sf-truths.vue'
import { VueSheetRenderHelperOptions } from '../vue/vue-render-helper'
import { VueAppMixin } from '../vue/vueapp.js'

export class SFSettingTruthsDialogVue extends VueAppMixin(FormApplication) {
  constructor() {
    super({})
  }

  static get defaultOptions(): FormApplicationOptions {
    return mergeObject(super.defaultOptions, {
      title: game.i18n.localize('IRONSWORN.JOURNALENTRYPAGES.TypeTruth'),
      id: 'setting-truths-dialog',
      resizable: true,
      width: 700,
      height: 700,
    })
  }

  protected async _updateObject(
    _event: Event,
    _formData?: object | undefined
  ): Promise<void> {
    // Nothing to do
  }

  get renderHelperOptions(): Partial<VueSheetRenderHelperOptions> {
    return {
      rootComponent: sfTruthsVue,
      vueData: async () => {
        const pack = game.packs.get('foundry-ironsworn.starforgedtruths')
        const documents = (await pack?.getDocuments()) as JournalEntry[]
        if (!documents) throw new Error("can't load truth JEs")

        // Avoid rollupjs's over-aggressive tree shaking
        const dfTruths = ((starforged as any).default as Starforged)[
          'Setting Truths'
        ]
        const truths = dfTruths.map((df) => ({
          df,
          je: documents.find(
            (x) => x.getFlag('foundry-ironsworn', 'dfid') === df.$id
          ),
        }))

        return {
          truths: truths.map(({ df, je }) => ({
            df,
            je: () => je, // Prevent vue from wrapping this in Reactive
          })),
        }
      },
    }
  }
}
