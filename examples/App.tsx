import {
	AppBar,
	Button,
	Container,
	Link,
	MenuItem,
	Paper,
	ThemePrivder,
	Typography
} from '@kemengjs/kemeng-ui'
import { css } from '@linaria/atomic'

export default function App() {
	return (
		<ThemePrivder>
			<Button
				style={{
					marginTop: '40px'
				}}
				fullWidth
				size='large'
				onCanPlay={async () => {
					console.log('absolute')
				}}
			>
				难崩
			</Button>
			<Typography variant='body1'>123123</Typography>
			<Link>test</Link>
			<Container>ddd</Container>
			<AppBar>gooods</AppBar>
			<Paper
				square
				className={css`
					&.kemengui-paperElevation {
						box-shadow: none;
					}
				`}
				style={{
					color: 'yellow'
				}}
			>
				123123
			</Paper>
			<MenuItem />
		</ThemePrivder>
	)
}
