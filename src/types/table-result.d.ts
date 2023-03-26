declare global {
	namespace foundry {
		namespace documents {
			interface TableResultSource {
				flags?: DocumentFlags
			}
			interface RollTableSource {
				flags: Record<string, Record<string, unknown>>
			}
		}
	}
	// add missing inheritance
	interface BaseTableResult<
		TParent extends foundry.documents.BaseRollTable | null
	> extends foundry.abstract.Document<TParent>,
			foundry.documents.TableResultSource {}
	// make TParent optional by providing a sensible default
	interface TableResult<TParent extends RollTable = RollTable>
		extends Pick<BaseTableResult<TParent>, 'text'> {}
}

export {}
