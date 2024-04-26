export function hexToRgb(hex: string) {
	let hexValue = hex.replace('#', '')

	if (hexValue.length === 3) {
		hexValue = hexValue
			.split('')
			.map(char => char + char)
			.join('')
	}

	const red = parseInt(hexValue.substring(0, 2), 16)
	const green = parseInt(hexValue.substring(2, 4), 16)
	const blue = parseInt(hexValue.substring(4, 6), 16)

	return `${red}, ${green}, ${blue}`
}
