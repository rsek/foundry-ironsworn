// default icon is
// folderIcon: CONFIG.Folder.sidebarIcon,

import type { OracleTable } from './oracle-table'

// TabDirectory#getData can be overridden to provide a directory-specific icon. e.g. { folderIcon: 'fa fa-my-icon' }
// there's also label and labelPlural

export class OracleDirectory extends RollTableDirectory {
	override initialize() {
		// Adapted from client/apps/sidebar/tab-directory.js on Friday April 20

		// Assign Folders
		this.folders = game?.folders?.filter(
			(f) => f.type === OracleDirectory.documentName && !f.canonical
		) as any

		// Assign Documents
		this.documents = OracleDirectory.collection.filter(
			(e: StoredDocument<OracleTable>) => e.visible && !e.canonical
		) as any

		// Build Tree
		this.tree = OracleDirectory.setupFolders(this.folders, this.documents)
	}
}
