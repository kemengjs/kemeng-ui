import { themeVariables } from './theme'

export const tag = 'kemengui'

export const k = (styleName: string) => {
	return `${tag}-${styleName}`
}

export const getK = (componentName: string) => {
	return (styleName: string) => {
		const firstChar = styleName.charAt(0).toUpperCase()
		const restOfStyleName = styleName.slice(1)
		const targetStyleName = firstChar + restOfStyleName

		return `${tag}-${componentName}${targetStyleName}`
	}
}

export const getOverlayAlpha = (elevation: number) => {
	let alphaValue: number
	if (elevation < 1) {
		alphaValue = 5.11916 * elevation ** 2
	} else {
		alphaValue = 4.5 * Math.log(elevation + 1) + 2
	}
	return (alphaValue / 100).toFixed(2)
}

export const unit = (value: number) => {
	return `calc(${themeVariables.spacing} * ${value})`
}
