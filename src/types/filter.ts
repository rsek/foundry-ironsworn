export class SearchFilter {
	static OPERATORS: {
		EQUALS: 0
	}
}

export interface SearchFilterConfiguration {
	/** Options which customize the behavior of the filter */
	options: {
		/** The CSS selector used to target the text input element. */
		inputSelector: string
		/** The CSS selector used to target the content container for these tabs. */
		contentSelector: string
		/** A callback function which executes when the filter changes. */
		callback: Function
		/** The initial value of the search query. */
		initial?: string
		/**
		 * The number of milliseconds to wait for text input before processing.
		 * @default 200
		 */
		delay?: number
	}
}

export interface FieldFilter<T> {
	/** The dot-delimited path to the field being filtered */
	field: string
	/** The search operator, from CONST.OPERATORS */
	operator?: CONST.OPERATORS
	/** Negate the filter, returning results which do NOT match the filter criteria */
	negate: boolean
	/** The value against which to test */
	value: T
}
