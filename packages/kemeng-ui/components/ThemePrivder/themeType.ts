export type ThemeColorType = {
	main: string
	light: string
	dark: string
	contrastText: string
}

export type ThemeOptions = {
	primary: ThemeColorType
	secondary?: Partial<ThemeColorType>
	error?: Partial<ThemeColorType>
	warning?: Partial<ThemeColorType>
	info?: Partial<ThemeColorType>
	success?: Partial<ThemeColorType>
	background?: {
		paper: string
		default: string
	}
	text?: {
		primary?: string
		secondary?: string
		disabled?: string
		icon?: string
	}
	divider?: string
}
