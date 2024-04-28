import { Button, Link, ThemePrivder, Typography } from '@kemengjs/kemeng-ui'

export default function App() {
	return (
		<ThemePrivder>
			<Button
				size='large'
				onCanPlay={async () => {
					console.log('absolute')
				}}
			>
				难崩
			</Button>
			<Typography variant='body1'>123123</Typography>
			<Link underline='hover'>test</Link>
		</ThemePrivder>
	)
}
