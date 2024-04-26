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
