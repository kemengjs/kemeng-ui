import { FC, ReactNode, useMemo } from 'react'
import { globalCssText } from './globalCss'
import { ThemeOptions, themeVariables } from '@ui/utils/theme'
import { light } from './defaultTheme'
import { mergeProps } from '../../utils/withDefaultProps'
import { isObject } from '../../utils/validate'
import { ThemeContext } from './themeContext'

export type ThemePrivderProps = {
	children?: ReactNode
	theme?: ThemeOptions
}

const defaultProps: ThemePrivderProps = {
	theme: light
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
	const { children, theme } = mergeProps(defaultProps, props)

	const themeText = useMemo(() => {
		return themeToText(theme)
	}, [theme])

	return (
		<ThemeContext.Provider value={theme}>
			<style>
				{`html {${themeText}}`}
				{`html {
					-webkit-font-smoothing: antialiased;
					-moz-osx-font-smoothing: grayscale;
					box-sizing: border-box;
					-webkit-text-size-adjust: 100%;
					-webkit-print-color-scheme: ${themeVariables.mode};
					color-scheme: ${themeVariables.mode}};
				}`}
				{globalCssText}
			</style>
			<div className={theme.mode === 'light' ? 'theme-light' : 'theme-dark'}>
				{children}
			</div>
		</ThemeContext.Provider>
	)
}

export default ThemePrivder
