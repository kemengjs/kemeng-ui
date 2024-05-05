// export getServerThemeStyle
export type ThemeColorTypeSub = {
	main: string
	light: string
	dark: string
	contrastText: string
	mainRgb: string
}

export type TypographyType = {
	fontFamily: string
	fontWeight: number
	fontSize: string
	lineHeight: number
	letterSpacing: string
}

export type ThemeMode = 'dark' | 'light'

export type ThemeOptions = {
	mode: ThemeMode
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
	dividerLight?: string
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
		selected: string
		selectedOpacity: number
		focus: string
		focusOpacity: number
	}
	shadows?: Record<number, string>

	typographyH1?: TypographyType
	typographyH2?: TypographyType
	typographyH3?: TypographyType
	typographyH4?: TypographyType
	typographyH5?: TypographyType
	typographyH6?: TypographyType
	typographySubtitle1?: TypographyType
	typographySubtitle2?: TypographyType
	typographyBody1?: TypographyType
	typographyBody2?: TypographyType
	typographyInherit?: TypographyType
	typographyButton?: TypographyType
	spacing?: string
	breakpoints?: {
		xs: string
		sm: string
		md: string
		lg: string
		xl: string
	}
	zIndex?: {
		appBar: number
		drawer: number
		modal: number
	}
	rtl?: string
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

const getThemeColorTypeSub = (name: string) => {
	return {
		main: `var(--${name}-main)`,
		light: `var(--${name}-light)`,
		dark: `var(--${name}-dark)`,
		contrastText: `var(--${name}-contrastText)`,
		mainRgb: `var(--${name}-mainRgb)`
	}
}

const getTypographyType = (name: string) => {
	return {
		fontFamily: `var(--${name}-fontFamily)`,
		fontWeight: `var(--${name}-fontWeight)`,
		fontSize: `var(--${name}-fontSize)`,
		lineHeight: `var(--${name}-lineHeight)`,
		letterSpacing: `var(--${name}-letterSpacing)`
	}
}

export const themeVariables: ThemeVariables = {
	mode: 'var(--mode)',
	primary: getThemeColorTypeSub('primary'),
	secondary: getThemeColorTypeSub('secondary'),
	error: getThemeColorTypeSub('error'),
	warning: getThemeColorTypeSub('warning'),
	info: getThemeColorTypeSub('info'),
	success: getThemeColorTypeSub('success'),
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
	dividerLight: 'var(--dividerLight)',
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
		hoverOpacity: 'var(--action-hoverOpacity)',
		selected: 'var(--action-selected)',
		selectedOpacity: 'var(--action-selectedOpacity)',
		focus: 'var(--action-focus)',
		focusOpacity: 'var(--action-focusOpacity)'
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
		8: 'var(--shadows-8)',
		16: 'var(--shadows-16)',
		24: 'var(--shadows-24)'
	},
	typographyH1: getTypographyType('typographyH1'),
	typographyH2: getTypographyType('typographyH2'),
	typographyH3: getTypographyType('typographyH3'),
	typographyH4: getTypographyType('typographyH4'),
	typographyH5: getTypographyType('typographyH5'),
	typographyH6: getTypographyType('typographyH6'),
	typographySubtitle1: getTypographyType('typographySubtitle1'),
	typographySubtitle2: getTypographyType('typographySubtitle2'),
	typographyBody1: getTypographyType('typographyBody1'),
	typographyBody2: getTypographyType('typographyBody2'),
	typographyInherit: getTypographyType('typographyInherit'),
	typographyButton: getTypographyType('typographyButton'),
	spacing: 'var(--spacing)',
	breakpoints: {
		xs: 'var(--breakpoints-xs)',
		sm: 'var(--breakpoints-sm)',
		md: 'var(--breakpoints-md)',
		lg: 'var(--breakpoints-lg)',
		xl: 'var(--breakpoints-xl)'
	},
	zIndex: {
		appBar: 'var(--zIndex-appBar)',
		drawer: 'var(--zIndex-drawer)',
		modal: 'var(--zIndex-modal)'
	}
}
