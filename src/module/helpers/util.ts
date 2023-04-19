import { ChallengeRank } from '../constants'

export function capitalize<T extends string>(txt: T): Capitalize<T> {
	const [first, ...rest] = txt
	return `${first.toUpperCase()}${rest.join('')}` as Capitalize<T>
}

/**
 * @returns A localized string label for the challenge rank.
 */
export function localizeRank(rank: ChallengeRank) {
	return game.i18n.localize(`IRONSWORN.CHALLENGERANK.${ChallengeRank[rank]}`)
}
