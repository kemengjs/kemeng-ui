import { createContext, useContext } from 'react'
import { ThemeOptions } from '../../utils'
import {
	CreateTransitionProps,
	createTransition,
	CreateTransitionOptions,
	getTransitionNum
} from './createTransition'

export const ThemeContext = createContext<ThemeOptions>(null)

export const useTheme = () => {
	const theme = useContext(ThemeContext) || ({} as ThemeOptions)

	const _createTransition = (
		props: CreateTransitionProps,
		options: CreateTransitionOptions
	) => {
		return createTransition(
			props,
			options,
			getTransitionNum(theme.transition.standard),
			theme.transition.easeInOut
		)
	}

	function getAutoHeightDuration(height: number) {
		if (!height) {
			return 0
		}

		const constant = height / 36

		return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10)
	}

	return {
		theme,
		createTransition: _createTransition,
		getAutoHeightDuration
	}
}
