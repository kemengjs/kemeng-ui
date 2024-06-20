import { FC, ReactNode, useMemo } from 'react'
import { globalCssText } from './globalCss'
import { ThemeOptions, themeVariables } from '@ui/utils/theme'
import { light } from './defaultTheme'
import { isObject } from '../../utils/validate'
import { ThemeContext } from './themeContext'
import { assignObj } from '../../utils/assign'

export type ThemePrivderProps = {
	children?: ReactNode
	theme?: ThemeOptions
}

const themeToText = (theme: ThemeOptions) => {
	let themeText = ''

	Object.keys(theme).forEach(firstKey => {
		const firstValue = theme[firstKey]
		if (isObject<ThemeOptions>(firstValue)) {
			Object.keys(firstValue).forEach(secondKey => {
				const secondValue = firstValue[secondKey]

				themeText += `--${firstKey}-${secondKey}: ${secondValue};`
			})
		} else {
			themeText += `--${firstKey}: ${firstValue};`
		}
	})
	return themeText
}

const ThemePrivder: FC<ThemePrivderProps> = props => {
	const { theme: themeProps = {} as ThemeOptions, children } = props
	const theme = assignObj<ThemeOptions>(light, themeProps)

	const themeText = useMemo(() => {
		return themeToText(theme)
	}, [theme])

	return (
		<ThemeContext.Provider value={theme}>
			<style
				dangerouslySetInnerHTML={{
					__html: `
					html {${themeText}}
					html {
					-webkit-font-smoothing: antialiased;
					-moz-osx-font-smoothing: grayscale;
					box-sizing: border-box;
					-webkit-text-size-adjust: 100%;
					-webkit-print-color-scheme: ${themeVariables.mode};
					color-scheme: ${themeVariables.mode}};}
					${globalCssText}
					`
				}}
			></style>
			<div className={theme.mode === 'light' ? 'theme-light' : 'theme-dark'}>
				{children}
			</div>
		</ThemeContext.Provider>
	)
}

export default ThemePrivder
