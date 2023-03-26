export interface IronTourStep extends TourStep {
	sidebarTab?: string
	layer?: string
	tool?: string
	hook?: () => Promise<unknown> | unknown
}

export interface IronTourConfig extends TourConfig {
	namespace: 'foundry-ironsworn'
	steps: IronTourStep[]
}

export class IronswornTour extends Tour {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(
		config: IronTourConfig,
		override: {
			id?: string | undefined
			namespace?: string | undefined
		} = {}
	) {
		super(config, override)
	}

	get steps(): IronTourStep[] {
		return super.steps as IronTourStep[]
	}

	get currentStep(): IronTourStep | null {
		return super.currentStep as IronTourStep | null
	}

	/** @override */
	protected async _preStep(): Promise<void> {
		await super._preStep()

		if (this.currentStep?.sidebarTab) {
			ui.sidebar.activateTab(this.currentStep.sidebarTab)
		}

		if (this.currentStep?.layer) {
			const layer = canvas?.[this.currentStep.layer]
			if (layer.active && this.currentStep.tool)
				ui.controls?.initialize({ tool: this.currentStep.tool })
			else layer.activate({ tool: this.currentStep.tool })
		}

		if (this.currentStep?.hook != null) {
			await this.currentStep.hook()
		}
	}
}
