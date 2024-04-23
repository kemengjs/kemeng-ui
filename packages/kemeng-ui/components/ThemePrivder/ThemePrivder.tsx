import { css } from '@linaria/core'
import { FC, ReactNode, useMemo } from 'react'
import { globalCssText } from './globalCss'
import { ThemeOptions } from './themeType'
import { light } from './defaultTheme'
import { mergeProps } from '../../utils/withDefaultProps'
import { isObject } from '../../utils/validate'

export type ThemePrivderProps = {
	children?: ReactNode
	theme?: ThemeOptions
}

const defaultProps: ThemePrivderProps = {
	theme: light
}

const themeToThemeText = (theme: ThemeOptions) => {
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
		return themeToThemeText(theme)
	}, [theme])

	const globalCss = css`
		${globalCssText}
	`
	const root = css`
		${themeText}
	`

	return <div>{children}</div>
}

export default ThemePrivder
