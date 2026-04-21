import { IronswornSettings } from '../helpers/settings'

import '../../styles/styles.less'
import '../../styles/_irontheme.scss'
import '../../styles/_ironcolor/zinc.scss'
import '../../styles/_ironcolor/phosphor.scss'
import '../../styles/_ironcolor/oceanic.scss'

export const PREFIX = 'ironcolor__'

export function colorSchemeSetup() {
	$(document.body).addClass(IronswornSettings.classes.join(' '))
}

/**
 * Instantly updates the client's color scheme without reloading.
 */
export function updateColorScheme(
	newColorScheme: ClientSettings.Values['foundry-ironsworn.color-scheme']
) {
	const colorSchemes = Object.keys(
		game.settings.settings.get('foundry-ironsworn.color-scheme')
			?.choices as unknown as Record<string, unknown>
	)

	const classesToRemove = colorSchemes.map((str) => `${PREFIX}${str}`)

	const toUpdate = [document.body]

	// FVTT module: PopOut!
	if (game.modules.get('popout')?.active != null) {
		// @ts-expect-error
		const PopOut = PopoutModule.singleton as any
		const popOuts = PopOut.poppedOut as Map<string, { window: Window | null }>

		for (const [, { window }] of popOuts) {
			if (window?.document != null) {
				toUpdate.push(window.document?.body)
			}
		}
	}
	$(toUpdate)
		.removeClass(classesToRemove.join(' '))
		.addClass(`${PREFIX}${newColorScheme}`)
}
