export class DieCursed extends foundry.dice.terms.Die {
	constructor(termData) {
		termData.faces = 10
		super(termData)
	}

	/* -------------------------------------------- */

	/** @override */
	static DENOMINATION = 's'

	/** @override */
	get total() {
		return this.results.filter((r) => r.result === 10).length
	}

	/* -------------------------------------------- */

	/** @override */
	getResultLabel({ result }) {
		if (result === 10) return '💀'
		return '&nbsp;'
	}
}
