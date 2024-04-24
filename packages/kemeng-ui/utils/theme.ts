// export getServerThemeStyle
export type ThemeColorTypeSub = {
	main: string
	light: string
	dark: string
	contrastText: string
}

export type ThemeOptions = {
	mode: 'dark' | 'light'
	primary: ThemeColorTypeSub
	secondary?: Partial<ThemeColorTypeSub>
	error?: Partial<ThemeColorTypeSub>
	warning?: Partial<ThemeColorTypeSub>
	info?: Partial<ThemeColorTypeSub>
	success?: Partial<ThemeColorTypeSub>
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

export type BaseColorType = keyof Pick<
	ThemeOptions,
	'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
>

export const themeVariables: Omit<ThemeOptions, 'mode'> & {
	mode: string
} = {
	mode: 'var(--mode)',
	primary: {
		main: 'var(--primary-main)',
		light: 'var(--primary-light)',
		dark: 'var(--primary-dark)',
		contrastText: 'var(--primary-contrastText)'
	},
	secondary: {
		main: 'var(--secondary-main)',
		light: 'var(--secondary-light)',
		dark: 'var(--secondary-dark)',
		contrastText: 'var(--secondary-contrastText)'
	},
	error: {
		main: 'var(--error-main)',
		light: 'var(--error-light)',
		dark: 'var(--error-dark)',
		contrastText: 'var(--error-contrastText)'
	},
	warning: {
		main: 'var(--warning-main)',
		light: 'var(--warning-light)',
		dark: 'var(--warning-dark)',
		contrastText: 'var(--warning-contrastText)'
	},
	info: {
		main: 'var(--info-main)',
		light: 'var(--info-light)',
		dark: 'var(--info-dark)',
		contrastText: 'var(--info-contrastText)'
	},
	success: {
		main: 'var(--success-main)',
		light: 'var(--success-light)',
		dark: 'var(--success-dark)',
		contrastText: 'var(--success-contrastText)'
	},
	background: {
		default: 'var(--background-default)',
		paper: 'var(--background-paper)'
	},
	text: {
		primary: 'var(--text-primary)',
		secondary: 'var(--text-secondary)',
		disabled: 'var(--text-disabled)',
		icon: 'var(--text-icon)'
	},
	divider: 'var(--divider)'
}
