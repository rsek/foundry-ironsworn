declare module 'foundry-types' {
	interface CanvasLayer {
		activate: (...args: any[]) => this
		_onClickLeft2: (event: PIXI.InteractionEvent) => void
		_onDragLeftDrop: (event: PIXI.InteractionEvent) => Promise<void>
	}
	/**
	 * A subclass of CanvasLayer which provides support for user interaction with its contained objects.
	 * @category - Canvas
	 */
	class InteractionLayer extends CanvasLayer {
		/**
		 * Is this layer currently active
		 */
		get active(): boolean

		/**
		 * Customize behaviors of this CanvasLayer by modifying some behaviors at a class level.
		 */
		static get layerOptions(): {
			name: string
			sortActiveTop: boolean
			zIndex: number
		}

		/* -------------------------------------------- */
		/*  Methods                                     */
		/* -------------------------------------------- */

		/**
		 * Activate the InteractionLayer, deactivating other layers and marking this layer's children as interactive.
		 * @param {string} [tool]   A specific tool in the control palette to set as active
		 * @returns {InteractionLayer}    The layer instance, now activated
		 */
		// @ts-expect-error foundry-types doesn't type the ancestor class correctly as of March 2023
		activate({ tool }: { tool: string }): this

		/**
		 * The inner _activate method which may be defined by each InteractionLayer subclass.
		 * @protected
		 */
		_activate(): void

		/* -------------------------------------------- */

		/**
		 * Deactivate the InteractionLayer, removing interactivity from its children.
		 * @returns The layer instance, now inactive
		 */
		deactivate(): this

		/**
		 * The inner _deactivate method which may be defined by each InteractionLayer subclass.
		 * @protected
		 */
		_deactivate(): void

		/* -------------------------------------------- */

		/** @override */
		_draw(options: object): Promise<void>
		/* -------------------------------------------- */

		/**
		 * Get the zIndex that should be used for ordering this layer vertically relative to others in the same Container.
		 */
		getZIndex(): number

		/* -------------------------------------------- */
		/*  Event Listeners and Handlers                */
		/* -------------------------------------------- */

		/**
		 * Handle left mouse-click events which originate from the Canvas stage.
		 * @see {@link Canvas._onClickLeft}
		 * @param  The PIXI InteractionEvent which wraps a PointerEvent
		 * @protected
		 */
		_onClickLeft(event: PIXI.InteractionEvent): void

		/* -------------------------------------------- */

		/**
		 * Handle double left-click events which originate from the Canvas stage.
		 * @see {@link Canvas._onClickLeft2}
		 * @param  The PIXI InteractionEvent which wraps a PointerEvent
		 * @protected
		 */
		_onClickLeft2(event: PIXI.InteractionEvent): void

		/* -------------------------------------------- */

		/**
		 * Start a left-click drag workflow originating from the Canvas stage.
		 * @see {@link Canvas._onDragLeftStart}
		 * @param event The PIXI InteractionEvent which wraps a PointerEvent
		 * @protected
		 */
		_onDragLeftStart(event: PIXI.InteractionEvent): Promise<void>

		/* -------------------------------------------- */

		/**
		 * Continue a left-click drag workflow originating from the Canvas stage.
		 * @see {@link Canvas._onDragLeftMove}
		 * @param event The PIXI InteractionEvent which wraps a PointerEvent
		 * @protected
		 */
		_onDragLeftMove(event: PIXI.InteractionEvent): void

		/* -------------------------------------------- */

		/**
		 * Conclude a left-click drag workflow originating from the Canvas stage.
		 * @see {@link Canvas._onDragLeftDrop}
		 * @param event The PIXI InteractionEvent which wraps a PointerEvent
		 * @protected
		 */
		_onDragLeftDrop(event: PIXI.InteractionEvent): Promise<void>

		/* -------------------------------------------- */

		/**
		 * Cancel a left-click drag workflow originating from the Canvas stage.
		 * @see {@link Canvas._onDragLeftDrop}
		 * @param event A right-click pointer event on the document.
		 * @protected
		 */
		_onDragLeftCancel(event: PointerEvent): void

		/* -------------------------------------------- */

		/**
		 * Handle right mouse-click events which originate from the Canvas stage.
		 * @see {@link Canvas._onClickRight}
		 * @param event The PIXI InteractionEvent which wraps a PointerEvent
		 * @protected
		 */
		_onClickRight(event: PIXI.InteractionEvent): void

		/* -------------------------------------------- */

		/**
		 * Handle mouse-wheel events which occur for this active layer.
		 * @see {@link MouseManager._onWheel}
		 * @param event The WheelEvent initiated on the document
		 * @protected
		 */
		_onMouseWheel(event: WheelEvent): void

		/* -------------------------------------------- */

		/**
		 * Handle a DELETE keypress while this layer is active.
		 * @see {@link ClientKeybindings._onDelete}
		 * @param event The delete key press event
		 * @protected
		 */
		_onDeleteKey(event: KeyboardEvent): Promise<void>
	}

	/* -------------------------------------------- */
}

export {}
