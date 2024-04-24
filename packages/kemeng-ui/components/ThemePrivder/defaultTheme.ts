import { ThemeOptions } from '../../utils'

export const light: ThemeOptions = {
	mode: 'light',
	primary: {
		main: '#FF5252',
		light: '#FF8A80',
		dark: '#FF1744',
		contrastText: '#fff'
	},
	secondary: {
		main: '#29B6F6',
		dark: '#039BE5',
		light: '#81D4FA',
		contrastText: '#fff'
	},
	warning: {
		main: '#EF6C00',
		dark: '#E65100',
		light: '#F57C00',
		contrastText: '#fff'
	},
	error: {
		main: '#FF3D00',
		dark: '#DD2C00',
		light: '#FF6E40',
		contrastText: '#fff'
	},
	info: {
		main: '#FF4081',
		dark: '#F50057',
		light: '#FF80AB',
		contrastText: '#fff'
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
	divider: 'rgba(0,0,0,0.12)'
}
