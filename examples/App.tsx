import { Button, ThemePrivder } from '@kemengjs/kemeng-ui'

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
		</ThemePrivder>
	)
}
