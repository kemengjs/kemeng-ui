import { createContext, useContext } from 'react'
import { ThemeOptions } from '../../utils'

export const ThemeContext = createContext<ThemeOptions>(null)

export const useTheme = () => {
	const theme = useContext(ThemeContext)

	return {
		theme
	}
}
