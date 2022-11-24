import { App } from 'vue'
import {
  VueAppRenderHelper,
  VueAppRenderHelperOptions,
} from './vue-render-helper.js'
import { VueAppMixin } from './vueapp.js'

export abstract class VueDialog<
  Options extends FormApplicationOptions = FormApplicationOptions
> extends VueAppMixin(FormApplication)<Options> {
  renderHelper: VueAppRenderHelper | undefined

  static override get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['ironsworn', 'dialog'],
      width: 400,
    })
  }

  abstract get renderHelperOptions(): Partial<VueAppRenderHelperOptions>

  abstract setupVueApp(app: App): void

  render(
    force?: boolean | undefined,
    options?: Application.RenderOptions<Options> | undefined
  ): this {
    this.renderHelper ||= new VueAppRenderHelper(
      this,
      {
        vueData: async () => ({}),
        ...this.renderHelperOptions,
      },
      this.setupVueApp.bind(this)
    )

    this.renderHelper.render(force, options)
    return this
  }

  get hasEditMode() {
    return false
  }
  _getHeaderButtons() {
    return super._getHeaderButtons()
  }

  // setupVueApp(app: App) {
  //   app.provide($ItemKey, this.item)
  // }

  // submit + close methods
}
