import type { App, Component, ComponentPublicInstance } from 'vue'
import { createApp } from 'vue'
import Mitt from 'mitt'
import type { LocalEmitter, LocalEmitterEvents } from './provisions.js'
import { $LocalEmitterKey } from './provisions.js'
import LoadingSpinner from './components/loading-spinner.vue'
import { IronswornSettings } from '../helpers/settings.js'
import { IronswornVuePlugin } from './vue-plugin.js'
import { pickBy } from 'lodash-es'
import { Hooks } from 'foundry-types/client/core/hooks'

export type Constructor<T = object> = abstract new (...args: any[]) => T

export interface VueApplicationOptions extends ApplicationOptions {
	rootComponent: Component
}

export function VueAppMixin<TBase extends Constructor<Application>>(
	Base: TBase
) {
	abstract class VueMixin extends Base {
		vueApp: App<Element> | undefined
		vueRoot: ComponentPublicInstance | undefined
		vueListenersActive = false
		localEmitter: LocalEmitter = Mitt<LocalEmitterEvents>()

		options!: VueApplicationOptions

		override async getData(options?: Partial<VueApplicationOptions>) {
			return await super.getData(options)
		}

		static get defaultOptions(): VueApplicationOptions {
			return mergeObject(
				// @ts-expect-error TS complains about super not having defaultOptions here, but Application does have it -- just on the class, not the constructor.
				super.defaultOptions,
				{
					classes: ['ironsworn'],
					template: 'systems/foundry-ironsworn/templates/vue-app.hbs',
					submitOnClose: false,
					submitOnChange: false
				}
			)
		}

		setupVueApp(app: App): void {
			// Implement in descendants if needed
		}

		async render(
			...args: [boolean | undefined, RenderOptions | undefined]
		): Promise<this> {
			const [force, options] = args
			const vueOptions = this.options
			const data = await this.getData()

			// Create the Vue App instance
			if (this.vueApp == null || this.vueRoot == null) {
				const provides = pickBy(data, (v, k) => k.startsWith('$'))

				this.vueRoot = undefined
				this.vueApp = createApp({
					components: {
						'loading-spinner': LoadingSpinner,
						'root-component': vueOptions.rootComponent
					},
					data() {
						return { data }
					},

					provide: {
						context: {
							options: this.options,
							themeClass: IronswornSettings.classes.join(' '),
							config: CONFIG.IRONSWORN
						},
						[$LocalEmitterKey as symbol]: this.localEmitter,
						...provides
					},

					methods: {
						updateData(newCtx) {
							for (const k of Object.keys(this.data)) {
								this.data[k] = newCtx[k]
							}
						}
					}
				})
				this.vueApp.config.unwrapInjectedRef = true
				this.vueApp.use(IronswornVuePlugin)
				this.setupVueApp(this.vueApp)
			} else {
				;(this.vueRoot as any).updateData(data)
				if (!this.vueListenersActive) {
					setTimeout(() => {
						this.activateVueListeners($(this.element), true)
					}, 150)
				}
				return this
			}

			// Stop here if we're closing
			if (this._state === Application.RENDER_STATES.CLOSING) return this

			// No active Vue root, so run Foundry's render and mount it
			try {
				// Execute Foundry's render.
				await this._render(...args)

				// Run Vue's render, assign it to our prop for tracking.
				const selector = `[data-appid="${this.appId}"] .vueroot`
				const $appEl = $(selector)
				if ($appEl.length > 0) {
					this.vueRoot = this.vueApp.mount(selector)
					setTimeout(() => {
						this.activateVueListeners($(this.element), true)
					}, 150)
				}
			} catch (err: any) {
				this._state = Application.RENDER_STATES.ERROR
				Hooks.onError('Application#render', err, {
					msg: `An error occurred while rendering ${this.constructor.name} ${this.id}`,
					log: 'error',
					data: { force, options }
				})
				console.error(
					`An error occurred while rendering ${this.constructor.name} ${
						this.id
					}: ${err.message as string}`,
					err
				)
			}

			if (this instanceof FormApplication) {
				this.object.apps[this.appId] = this
			}

			return this
		}

		async close(
			options?:
				| ({
						force?: boolean | undefined
				  } & Record<string, unknown>)
				| undefined
		) {
			this.vueApp?.unmount()
			this.vueApp = undefined
			this.vueRoot = undefined
			await super.close(options)
		}

		/**
		 * Activate additional listeners on the rendered Vue app.
		 */
		activateVueListeners(html: JQuery, repeat = false) {
			this._dragHandler(html)

			// Place one-time executions after this line.
			if (repeat) return

			// Input listeners.
			const inputs =
				'.section input[type="text"], .section input[type="number"]'
			html.on('focus', inputs, (event) => {
				this._onFocus(event)
			})
		}

		_onFocus(event: JQuery.FocusEvent) {
			const target = event.currentTarget as Element | undefined
			setTimeout(() => {
				if (target && target === document.activeElement) {
					$(target).trigger('select')
				}
			}, 100)
		}

		_dragHandler(html: JQuery) {
			// HACK this should just be typed as ElementDragEvent, which inherits DragEvent. But typescript doesn't accept it -- perhaps related to https://github.com/microsoft/TypeScript/issues/50754
			const dragHandler = (event: DragEvent) => {
				this._onDragStart(event as ElementDragEvent)
			}
			html.find('.item[data-draggable="true"]').each((i, li) => {
				li.setAttribute('draggable', 'true') // this apparently requires a string, rather than a boolean
				li.addEventListener('dragstart', dragHandler, false)
			})
		}
	}
	return VueMixin
}
