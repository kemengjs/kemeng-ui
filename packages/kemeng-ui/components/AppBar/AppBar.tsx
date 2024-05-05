import { ReactNode, forwardRef } from 'react'
import { BaseColorType, themeVariables } from '../../utils'
import { cx, styled } from '@linaria/atomic'
import Paper, { PaperProps } from '../Paper'
import { getK } from '../../utils/style'
import { withNativeElementProps } from '../../utils/nativeProps'

const k = getK('AppBar')

const AppBarRoot = styled(Paper)<AppBarProps>`
	display: flex;
	flex-direction: column;
	width: 100%;
	box-sizing: border-box;
	flex-shrink: 0;

	color: ${({ color }) => {
		return themeVariables[color].contrastText
	}};
	background-color: ${({ color }) => {
		return color === 'transparent' ? 'transparent' : themeVariables[color].main
	}};

	&.${k('fixed')} {
		position: fixed;
		z-index: ${themeVariables.zIndex.appBar};
		top: 0;
		left: auto;
		right: 0;

		@media print {
			position: absolute;
		}
	}

	&.${k('absolute')} {
		position: absolute;
		z-index: ${themeVariables.zIndex.appBar};
		top: 0;
		left: auto;
		right: 0;
	}

	&.${k('sticky')} {
		position: sticky;
		z-index: ${themeVariables.zIndex.appBar};
		top: 0;
		left: auto;
		right: 0;
	}

	&.${k('static')} {
		position: static;
	}

	&.${k('relative')} {
		position: relative;
	}
`

export type AppBarProps = {
	color?: BaseColorType | 'transparent'
	children?: ReactNode
	position?: 'fixed' | 'absolute' | 'sticky' | 'static' | 'relative'
	variant?: PaperProps['variant']
} & JSX.IntrinsicElements['div']

const AppBar = forwardRef<HTMLDivElement, AppBarProps>((p, ref) => {
	const {
		color = 'primary',
		position = 'fixed',
		variant = 'elevation',
		...other
	} = p

	return withNativeElementProps(
		p,
		<AppBarRoot
			square
			className={cx(
				position === 'fixed'
					? k('fixed')
					: position === 'absolute'
						? k('absolute')
						: position === 'relative'
							? k('relative')
							: position === 'sticky'
								? k('sticky')
								: k('static')
			)}
			ref={ref}
			color={color}
			elevation={4}
			variant={variant}
			{...other}
		></AppBarRoot>
	)
})

export default AppBar
