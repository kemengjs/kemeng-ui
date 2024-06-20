import { ThemeOptions } from '../../utils'

export const light: ThemeOptions = {
	mode: 'light',
	primary: {
		main: '#FF5252',
		light: '#FF8A80',
		dark: '#FF1744',
		contrastText: '#fff',
		mainRgb: '255, 82, 82',
		lightRgb: '255, 138, 128'
	},
	secondary: {
		main: '#29B6F6',
		dark: '#039BE5',
		light: '#81D4FA',
		contrastText: '#fff',
		mainRgb: '41, 182, 246',
		lightRgb: '129, 212, 250'
	},
	warning: {
		main: '#EF6C00',
		dark: '#E65100',
		light: '#F57C00',
		contrastText: '#fff',
		mainRgb: '239, 108, 0',
		lightRgb: '245, 124, 0'
	},
	success: {
		main: '#76FF03',
		dark: '#64DD17',
		light: '#B2FF59',
		contrastText: '#000',
		mainRgb: '118, 255, 3',
		lightRgb: '178, 255, 89'
	},
	error: {
		main: '#FF3D00',
		dark: '#DD2C00',
		light: '#FF6E40',
		contrastText: '#fff',
		mainRgb: '255, 61, 0',
		lightRgb: '255, 110, 64'
	},
	info: {
		main: '#FF4081',
		dark: '#F50057',
		light: '#FF80AB',
		contrastText: '#fff',
		mainRgb: '255, 64, 129',
		lightRgb: '255, 128, 171'
	},
	background: {
		paper: '#fff',
		default: '#fff'
	},
	text: {
		primary: 'rgba(0,0,0,0.96)',
		secondary: 'rgba(0,0,0,0.7)',
		disabled: 'rgba(0,0,0,0.38)'
	},
	divider: 'rgba(0,0,0,0.12)',
	dividerLight: 'rgba(0,0,0,0.08)',
	shape: {
		borderRadius: '4px'
	},
	transition: {
		easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
		easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
		easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
		sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
		shortest: '150ms',
		shorter: '200ms',
		short: '250ms',
		standard: '300ms',
		complex: '375ms',
		enteringScreen: '225ms',
		leavingScreen: '195ms'
	},
	action: {
		active: 'rgba(0,0,0,0.54)',
		hover: 'rgba(0,0,0,0.04)',
		disabled: 'rgba(0,0,0,0.26)',
		disabledBackground: 'rgba(0,0,0,0.12)',
		disabledOpacity: 0.38,
		hoverOpacity: 0.04,
		selected: 'rgba(0, 0, 0, 0.08)',
		selectedOpacity: 0.08,
		focus: 'rgba(0, 0, 0, 0.12)',
		focusOpacity: 0.12
	},
	shadows: {
		0: 'none',
		1: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
		2: '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
		3: '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
		4: '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
		5: '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
		6: '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
		7: '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
		8: '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
		16: '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
		24: '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)'
	},

	typographyH1: {
		fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
		fontWeight: 300,
		fontSize: '6rem',
		lineHeight: 1.167,
		letterSpacing: '-0.01562em'
	},
	typographyH2: {
		fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
		fontWeight: 300,
		fontSize: '3.75rem',
		lineHeight: 1.2,
		letterSpacing: '-0.00833em'
	},
	typographyH3: {
		fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
		fontWeight: 400,
		fontSize: '3rem',
		lineHeight: 1.167,
		letterSpacing: '0em'
	},
	typographyH4: {
		fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
		fontWeight: 400,
		fontSize: '2.125rem',
		lineHeight: 1.235,
		letterSpacing: '0.00735em'
	},
	typographyH5: {
		fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
		fontWeight: 400,
		fontSize: '1.5rem',
		lineHeight: 1.334,
		letterSpacing: '0em'
	},
	typographyH6: {
		fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
		fontWeight: 500,
		fontSize: '1.25rem',
		lineHeight: 1.6,
		letterSpacing: '0.0075em'
	},
	typographySubtitle1: {
		fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
		fontWeight: 400,
		fontSize: '1rem',
		lineHeight: 1.75,
		letterSpacing: '0.00938em'
	},
	typographySubtitle2: {
		fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
		fontWeight: 500,
		fontSize: '0.875rem',
		lineHeight: 1.57,
		letterSpacing: '0.00714em'
	},
	typographyBody1: {
		fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
		fontWeight: 400,
		fontSize: '1rem',
		lineHeight: 1.5,
		letterSpacing: '0.00938em'
	},
	typographyBody2: {
		fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
		fontWeight: 400,
		fontSize: '0.875rem',
		lineHeight: 1.43,
		letterSpacing: '0.01071em'
	},
	typographyButton: {
		fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
		fontWeight: 500,
		fontSize: '0.875rem',
		lineHeight: 1.75,
		letterSpacing: '0.02857em'
	},
	typographyCaption: {
		fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
		fontWeight: 400,
		fontSize: '0.75rem',
		lineHeight: 1.66,
		letterSpacing: '0.03333em'
	},
	spacing: '8px',
	breakpoints: {
		xs: '444px',
		sm: '600px',
		md: '900px',
		lg: '1200px',
		xl: '1536px'
	},
	grid: {
		columnSpacing: '8px',
		rowSpacing: '8px'
	},
	zIndex: {
		appBar: 1100,
		drawer: 1200,
		modal: 1300
	},
	rtl: 'ltr'
}
