import { CreateActorDialog } from '../applications/createActorDialog'
import type { ActorSystemMap, IronswornActorData } from './actortypes'
import type { SFCharacterMoveSheet } from './sheets/sf-charactermovesheet'

let CREATE_DIALOG: CreateActorDialog

/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 */
export class IronswornActor<
	T extends ActorType = ActorType
> extends Actor<any> {
	// redclare some properties for stricter typings
	get type(): T {
		return super.type as T
	}

	system!: ActorSystemMap[T]
	data!: IronswornActorData<T>

	// toObject(source?: true): this['_source']
	// toObject(source: false): RawObject<this['data']>
	// toObject(source?: boolean) {
	// 	return super.toObject(source)
	// }

	override async createEmbeddedDocuments<TName extends 'Item' | 'ActiveEffect'>(
		embeddedName: TName,
		data: Array<PreCreate<DocumentSource<TName>>>,
		context?: DocumentModificationContext<this> | undefined
	): Promise<Array<DocumentClass<TName>>> {
		return (await super.createEmbeddedDocuments(
			embeddedName,
			data,
			context
		)) as Array<DocumentClass<TName>>
	}

	moveSheet?: SFCharacterMoveSheet

	protected override _onCreate(
		data: this['_source'],
		options: DocumentModificationContext<null>,
		userId: string
	): void {
		super._onCreate(data, options, userId)
		switch (this.type) {
			case 'site':
				// initialize sourceId flags for denizens
				{
					const denizens = (
						this as IronswornActor<'site'>
					).system.denizens?.map((denizen) => {
						denizen.flags['foundry-ironsworn'].sourceId = this.id
						return denizen
					})
					this.update({ system: { denizens } })
				}

				break
			default:
				break
		}
	}

	static override async createDialog(
		data: PreCreate<IronswornActor>,
		_context
	) {
		if (!CREATE_DIALOG) CREATE_DIALOG = new CreateActorDialog()
		if (data?.folder?._id) CREATE_DIALOG.options.folder = data.folder._id
		CREATE_DIALOG.render(true)
		return null
	}

	async burnMomentum() {
		if (this.type !== 'character') return
		const { momentum, momentumReset } = (this as IronswornActor<'character'>)
			.system
		console.log({ momentum, momentumReset })
		if (momentum > momentumReset) {
			this.update({
				system: { momentum: momentumReset }
			})
		}
	}

	get toolset(): 'ironsworn' | 'starforged' {
		// We can't use IronswornSettings helpers here, it breaks the import orders
		// First check if the toolbox is set to one or the other
		const toolbox = game.settings.get('foundry-ironsworn', 'toolbox')
		if (toolbox === 'ironsworn') return 'ironsworn'
		if (toolbox === 'starforged') return 'starforged'

		// Set to "match sheet", so check for a specific setting on this actor
		if (this.type === 'character') {
			return this.sheet?.constructor.name === 'StarforgedCharacterSheet'
				? 'starforged'
				: 'ironsworn'
		}

		// Nope, now check the default character sheet class
		const sheetClasses = game.settings.get('core', 'sheetClasses')
		return sheetClasses.Actor?.character ===
			'ironsworn.StarforgedCharacterSheet'
			? 'starforged'
			: 'ironsworn'
	}
}

Hooks.on('createActor', async (actor, _ctx, _userId) => {
	if (!['character', 'shared'].includes(actor.type)) return

	await Item.createDocuments([{ type: 'bondset', name: 'bonds' }], {
		parent: actor,
		suppressLog: true
	})
})
