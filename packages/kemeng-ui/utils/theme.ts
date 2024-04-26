// export getServerThemeStyle
export type ThemeColorTypeSub = {
	main: string
	light: string
	dark: string
	contrastText: string
	mainRgb: string
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
	shape?: {
		borderRadius: string
	}
	transition?: {
		easeInOut?: string
		easeOut?: string
		easeIn?: string
		sharp?: string
		shortest?: string
		shorter?: string
		short?: string
		standard?: string
		complex?: string
		enteringScreen?: string
		leavingScreen?: string
	}
	action?: {
		active: string
		hover: string
		hoverOpacity: number
		disabled: string
		disabledBackground: string
		disabledOpacity: number
	}
	shadows?: Record<number, string>
}

type ThemeVariables = {
	[K in keyof ThemeOptions]: ThemeOptions[K] extends object
		? {
				[T in keyof ThemeOptions[K]]: string
			}
		: string
}

export type BaseColorType = keyof Pick<
	ThemeOptions,
	'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
>

export const themeVariables: ThemeVariables = {
	mode: 'var(--mode)',
	primary: {
		main: 'var(--primary-main)',
		light: 'var(--primary-light)',
		dark: 'var(--primary-dark)',
		contrastText: 'var(--primary-contrastText)',
		mainRgb: 'var(--primary-mainRgb)'
	},
	secondary: {
		main: 'var(--secondary-main)',
		light: 'var(--secondary-light)',
		dark: 'var(--secondary-dark)',
		contrastText: 'var(--secondary-contrastText)',
		mainRgb: 'var(--secondary-mainRgb)'
	},
	error: {
		main: 'var(--error-main)',
		light: 'var(--error-light)',
		dark: 'var(--error-dark)',
		contrastText: 'var(--error-contrastText)',
		mainRgb: 'var(--error-mainRgb)'
	},
	warning: {
		main: 'var(--warning-main)',
		light: 'var(--warning-light)',
		dark: 'var(--warning-dark)',
		contrastText: 'var(--warning-contrastText)',
		mainRgb: 'var(--warning-mainRgb)'
	},
	info: {
		main: 'var(--info-main)',
		light: 'var(--info-light)',
		dark: 'var(--info-dark)',
		contrastText: 'var(--info-contrastText)',
		mainRgb: 'var(--info-mainRgb)'
	},
	success: {
		main: 'var(--success-main)',
		light: 'var(--success-light)',
		dark: 'var(--success-dark)',
		contrastText: 'var(--success-contrastText)',
		mainRgb: 'var(--success-mainRgb)'
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
	divider: 'var(--divider)',
	shape: {
		borderRadius: 'var(--shape-borderRadius)'
	},
	transition: {
		easeInOut: 'var(--transition-easeInOut)',
		easeOut: 'var(--transition-easeOut)',
		easeIn: 'var(--transition-easeIn)',
		sharp: 'var(--transition-sharp)',
		shortest: 'var(--transition-shortest)',
		shorter: 'var(--transition-shorter)',
		short: 'var(--transition-short)',
		standard: 'var(--transition-standard)',
		complex: 'var(--transition-complex)',
		enteringScreen: 'var(--transition-enteringScreen)',
		leavingScreen: 'var(--transition-leavingScreen)'
	},
	action: {
		active: 'var(--action-active)',
		hover: 'var(--action-hover)',
		disabled: 'var(--action-disabled)',
		disabledBackground: 'var(--action-disabledBackground)',
		disabledOpacity: 'var(--action-disabledOpacity)',
		hoverOpacity: 'var(--action-hoverOpacity)'
	},
	shadows: {
		0: 'var(--shadows-0)',
		1: 'var(--shadows-1)',
		2: 'var(--shadows-2)',
		3: 'var(--shadows-3)',
		4: 'var(--shadows-4)',
		5: 'var(--shadows-5)',
		6: 'var(--shadows-6)',
		7: 'var(--shadows-7)',
		8: 'var(--shadows-8)'
	}
}
