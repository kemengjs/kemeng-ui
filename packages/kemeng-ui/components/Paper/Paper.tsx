import { cx, styled } from '@linaria/atomic'
import { forwardRef } from 'react'
import { withNativeElementProps } from '../../utils/nativeProps'
import { ThemeMode, themeVariables } from '../../utils'
import { getK, getOverlayAlpha } from '../../utils/style'
import { useTheme } from '../ThemePrivder'

export type PaperProps = {
	variant?: 'elevation' | 'outlined'
	square?: boolean
	elevation?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 16 | 24
} & JSX.IntrinsicElements['div']

const k = getK('paper')

type PaperRootProps = PaperProps & {
	mode: ThemeMode
}

const PaperRoot = styled.div<PaperRootProps>`
	background-color: ${themeVariables.background.paper};
	color: ${themeVariables.text.primary};
	transition: box-shadow ${themeVariables.transition.standard}
		${themeVariables.transition.easeInOut} 0ms;
	border-radius: ${themeVariables.shape.borderRadius};

	&.${k('square')} {
		border-radius: 0;
	}

	&.${k('outlined')} {
		border: 1px solid ${themeVariables.divider};
	}

	&.${k('elevation')} {
		box-shadow: ${({ elevation }) => themeVariables.shadows[elevation]};
		background-image: ${({ mode, elevation }) =>
			mode === 'dark'
				? `linear-gradient(rgba(255,255,255,${getOverlayAlpha(elevation)}), rgba(255,255,255,${getOverlayAlpha(elevation)}))`
				: 'none'};
	}
`

const Paper = forwardRef<HTMLDivElement, PaperProps>((p, ref) => {
	const { elevation = 1, square = false, variant = 'elevation', children } = p
	const { theme } = useTheme()

	return withNativeElementProps(
		p,
		<PaperRoot
			ref={ref}
			elevation={elevation}
			mode={theme.mode}
			className={cx(
				square && k('square'),
				variant === 'elevation' ? k('elevation') : k('outlined')
			)}
		>
			{children}
		</PaperRoot>
	)
})

export default Paper
