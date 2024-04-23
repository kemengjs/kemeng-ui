import { Button, ThemePrivder } from '@kemengjs/kemeng-ui'
import { css, cx } from '@linaria/atomic'

const ct = css`
	color: blue;
`

export default function App() {
	return (
		<ThemePrivder>
			<Button className={ct}></Button>
		</ThemePrivder>
	)
}
