// default icon is
// folderIcon: CONFIG.Folder.sidebarIcon,

import { IronFolder } from '../folder/folder'
import type { OracleTable } from './oracle-table'

// TabDirectory#getData can be overridden to provide a directory-specific icon. e.g. { folderIcon: 'fa fa-my-icon' }
// there's also label and labelPlural

export class OracleDirectory<
	Options extends SidebarDirectory.Options = SidebarDirectory.Options
> extends RollTableDirectory<Options> {
	declare collection: Collection<OracleTable>
	override initialize() {
		// Adapted from client/apps/sidebar/tab-directory.js on Friday April 20

		// Assign Folders
		this.folders = game?.folders?.filter(
			(f) => f.type === 'RollTable' && !f.canonical
		) as IronFolder[]

		// Assign Documents
		this.documents = OracleDirectory.collection.filter(
			(e) => e.visible && !e.canonical
		)

		// Build Tree
		this.tree = OracleDirectory.setupFolders(this.folders, this.documents)
	}
}
