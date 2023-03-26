declare interface IronDocFlags extends DocumentFlags {
	'foundry-ironsworn'?: {
		'edit-mode'?: boolean
		muteBroadcast?: boolean
	}
}
declare interface IronRollTableFlags extends IronDocFlags {
	// @ts-expect-error FIXME this flag is un-namespaced as written. it should be moved to the foundry-ironsworn scope like our other flags. This means regenerating the DB files... or just hand-correcting them before the LevelDB migration
	category?: string
}

export {}
