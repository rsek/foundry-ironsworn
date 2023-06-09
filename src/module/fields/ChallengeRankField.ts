import { ChallengeRank } from '../constants'
import { capitalize } from '../helpers/util'
import { enumEntries } from '../fields/utils'

export class ChallengeRankField extends foundry.data.fields.NumberField {
	constructor(
		options?: Partial<
			Omit<
				foundry.data.fields.NumberField.Options,
				'choices' | 'step' | 'integer' | 'max' | 'min' | 'positive'
			>
		>
	) {
		super({
			label: 'IRONSWORN.ChallengeRank',
			choices: Object.fromEntries(
				enumEntries(ChallengeRank).map(([k, v]) => [
					v,
					`IRONSWORN.CHALLENGERANK.${k}`
				])
			),
			initial: ChallengeRank.Troublesome,
			integer: true,
			max: ChallengeRank.Epic,
			min: ChallengeRank.Troublesome,
			...options
		})
	}

	override _cast(value: unknown) {
		switch (true) {
			// migration: "formidible" -> "formidable"
			// TODO: use this instead of migration #1
			case value === 'formidible':
				return ChallengeRank.Formidable
			// migration: string-based challenge ranks to numeric ones
			// TODO: use this instead of migration #5
			case typeof value === 'string':
				return ChallengeRank[capitalize(value as string) as keyof ChallengeRank]
			default: {
				return super._cast(value)
			}
		}
	}
}

export interface ChallengeRankField extends foundry.data.fields.NumberField {}