import { InteractionLayer } from 'foundry-types'
import { IronswornActor } from '../actor/actor'
import { OracleWindow } from '../applications/oracle-window'
import { EditSectorDialog } from '../applications/sf/editSectorApp'
import { IronswornSettings } from '../helpers/settings'

function warn() {
	ui.notifications?.warn('Soon™')
}

declare global {
	namespace foundry {
		namespace documents {
			interface TokenSource {
				rotation: number
			}
		}
	}
	interface TokenDocument<TParent extends Scene | null>
		extends Omit<
			foundry.documents.TokenSource,
			'light' | 'hidden' | 'actorLink' | '_id'
		> {}
	interface Folder<
		TDocument extends EnfolderableDocument = EnfolderableDocument
	> {
		/**
		 * An array of other Folders which are the displayed children of this one. This differs from the results of
		 * {@link Folder.getSubfolders} because reports the subset of child folders which  are displayed to the current User
		 * in the UI.
		 */
		children?: Array<Folder<TDocument>>
	}

	/**
	 * Return a reference to the Document class implementation which is configured for use.
	 * @param documentName The canonical Document name, for example "Actor"
	 * @returns The configured Document class implementation
	 */
	function getDocumentClass<T extends DocType>(
		documentName: T
	): (typeof CONFIG)[T]['documentClass']
}

// Make sure a folder exists, e.g. ['Locations', 'Sector 05']
async function ensureFolder(
	...path: string[]
): Promise<Folder<IronswornActor> | undefined> {
	let parentFolder: Folder<IronswornActor> | undefined
	let directory: Array<Folder<IronswornActor>> | undefined =
		game.folders?.filter((x) => x.type === 'Actor')
	for (const name of path) {
		if (directory === undefined) {
			ui.notifications?.warn('Actor folders not found???')
			return
		}
		const existing = directory.find((x) => x.name === name)
		if (existing != null) {
			parentFolder = existing
			directory = existing.children?.map((child) => {
				return child.folder /* v10 */ ?? child /* v9 */
			})
			continue
		}
		parentFolder = await Folder.create<Folder<IronswornActor<any, any>>>({
			type: 'Actor',
			name,
			parent: parentFolder?.id
		})
		directory = parentFolder?.children
	}
	return parentFolder
}

function editSector() {
	const sceneId = game.user?.viewedScene
	if (sceneId) {
		new EditSectorDialog(sceneId).render(true)
	}
}

async function dropToken(location: IronswornActor<any, any>) {
	if (canvas?.scene == null || canvas.stage == null || canvas.grid == null)
		return

	// Calculate coordinates in the center of the viewport
	const { clientWidth, clientHeight } = document.documentElement
	const [cx, cy] = [clientWidth / 2, clientHeight / 2] // Center of viewport
	const t = canvas.stage.worldTransform
	const scale = canvas.stage.scale
	const [x, y] = [(cx - t.tx) / scale.x, (cy - t.ty) / scale.y]

	// Snap to viewport
	const td = await location.getTokenDocument({
		x,
		y
	})
	const hw = canvas.grid.w / 2
	const hh = canvas.grid.h / 2
	const pos = canvas.grid.getSnappedPosition(
		td.x - td.width * hw,
		td.y - td.height * hh
	)
	td.update(pos)

	const ctx: DocumentModificationContext<Scene> = { parent: canvas.scene }

	// TODO: avoid dropping this on top of another token

	// Create the token
	const cls = getDocumentClass('Token')
	await cls.create<TokenDocument<Scene>>(
		td as foundry.documents.TokenSource,
		ctx
	)

	// Move the user back to the token layer
	canvas.tokens?.activate()
}

async function newLocation(subtype: string, i18nKey: string, scale = 1) {
	const name = game.i18n.format('DOCUMENT.New', {
		type: game.i18n.localize(`IRONSWORN.${i18nKey}`)
	})
	const parentFolder = await ensureFolder(
		'Locations',
		game.scenes?.current?.name ?? '???'
	)

	const data: PreCreate<
		IronswornActor<'location', TokenDocument<Scene>>['_source']
	> = {
		type: 'location',
		name,
		system: { subtype },
		// FIXME: `token` doesn't appear to exist on Actor source data in Foundry's code, so it probably shouldn't be relied upon. Could this be done after token creation instead?
		token: {
			displayName: CONST.TOKEN_DISPLAY_MODES.ALWAYS,
			disposition: CONST.TOKEN_DISPOSITIONS.NEUTRAL,
			actorLink: true,
			texture: { scaleX: scale, scaleY: scale }
		} as any,
		folder: parentFolder?.id ?? null
	} as any
	const loc = await IronswornActor.create<
		IronswornActor<'location', TokenDocument<Scene>>
	>(data)
	if (loc == null) return

	await dropToken(loc)
	loc?.sheet?.render(true)
}

function newPlanet() {
	newLocation('planet', 'ACTOR.SubtypePlanet')
}

function newStar() {
	newLocation('star', 'ACTOR.SubtypeStar')
}

function newSettlement() {
	newLocation('settlement', 'ACTOR.SubtypeSettlement', 2)
}

function newDerelict() {
	newLocation('derelict', 'ACTOR.SubtypeDerelict', 2)
}

function newVault() {
	newLocation('vault', 'ACTOR.SubtypeVault', 2)
}

let ORACLE_WINDOW: OracleWindow | undefined
function theOracleWindow() {
	if (ORACLE_WINDOW == null) ORACLE_WINDOW = new OracleWindow()
	return ORACLE_WINDOW
}

declare global {
	interface SceneControl {
		activeTool: string
	}
}

export function activateSceneButtonListeners() {
	Hooks.on(
		'getSceneControlButtons',
		// @ts-expect-error TS gets cranky about this even though typings for this hook exist.
		(controls) => {
			const oracleButton: SceneControlTool = {
				name: 'Oracles',
				title: game.i18n.localize('IRONSWORN.ROLLTABLES.TypeOracle'),
				icon: 'isicon-oracle',
				visible: true,
				button: true,
				onClick: async () =>
					await theOracleWindow().render(true, { focus: true })
			}
			controls[0].tools.push(oracleButton)

			if (IronswornSettings.starforgedToolsEnabled) {
				const sfControl: SceneControl = {
					name: 'Starforged',
					title: game.i18n.localize('IRONSWORN.StarforgedTools'),
					icon: 'isicon-logo-starforged-dk',
					layer: 'ironsworn',
					visible: true,
					activeTool: 'select',
					tools: [oracleButton]
				}

				if (game.user?.isGM) {
					sfControl.tools.push(
						{
							name: 'edit',
							visible: true,
							icon: 'isicon-region-sf',
							title: game.i18n.localize('IRONSWORN.EditSector'),
							onClick: editSector
						},
						// { // TODO: maybe reenable this when we have a good way of doing it
						//   name: 'sector',
						//   icon: 'isicon-sector',
						//   title: game.i18n.format('DOCUMENT.Create',{type: ('IRONSWORN.SCENE.TypeSector')}),
						//   onClick: warn,
						// },
						{
							name: 'star',
							icon: 'isicon-stellar-object',
							visible: true,
							title: game.i18n.format('DOCUMENT.Create', {
								type: game.i18n.localize('IRONSWORN.ACTOR.SubtypeStar')
							}),
							onClick: newStar
						},
						{
							name: 'planet',
							icon: 'isicon-world',
							visible: true,
							title: game.i18n.format('DOCUMENT.Create', {
								type: game.i18n.localize('IRONSWORN.ACTOR.SubtypePlanet')
							}),
							onClick: newPlanet
						},
						{
							name: 'settlement',
							icon: 'isicon-settlement-sf',
							visible: true,
							title: game.i18n.format('DOCUMENT.Create', {
								type: game.i18n.localize('IRONSWORN.ACTOR.SubtypeSettlement')
							}),
							onClick: newSettlement
						},
						{
							name: 'derelict',
							icon: 'isicon-derelict',
							visible: true,
							title: game.i18n.format('DOCUMENT.Create', {
								type: game.i18n.localize('IRONSWORN.ACTOR.SubtypeDerelict')
							}),
							onClick: newDerelict
						},
						{
							name: 'vault',
							icon: 'isicon-precursor-vault',
							visible: true,
							title: game.i18n.format('DOCUMENT.Create', {
								type: game.i18n.localize('IRONSWORN.ACTOR.SubtypeVault')
							}),
							onClick: newVault
						}
					)
				}

				controls.push(sfControl)
			} else {
				const isControl: SceneControl = {
					name: 'Ironsworn',
					title: game.i18n.localize('IRONSWORN.IronswornTools'),
					icon: 'isicon-logo-ironsworn-dk',
					layer: 'ironsworn',
					visible: true,
					activeTool: 'select',
					tools: [oracleButton]
				}

				controls.push(isControl)
			}

			return controls
		}
	)
}

export class IronswornCanvasLayer extends InteractionLayer {
	static get layerOptions() {
		return foundry.utils.mergeObject(super.layerOptions, {
			zIndex: 180,
			name: 'ironsworn'
		})
	}
}
