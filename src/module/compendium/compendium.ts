import { OracleTable } from '../roll-table/oracle-table'

export class IronCompendiumCollection<
	T extends CompendiumCollection.Metadata
> extends CompendiumCollection<T> {
	deleteAll() {
		for (const item of this) {
			this.index.delete(item.id)
			this.delete(item.id)
		}
	}
}

// could the compendium get some flags that marks it for use as tree data?
// for example, keeping: a list of all folders?
