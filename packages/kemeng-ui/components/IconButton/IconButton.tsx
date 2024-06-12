import { cx, styled } from '@linaria/atomic'
import { getK } from '../../utils/style'
import { forwardRef } from 'react'
import {
	NativeJSXElementsWithoutRef,
	withNativeElementProps
} from '../../utils/nativeProps'
import ButtonBase from '../Button/ButtonBase'
import { BaseColorType, themeVariables } from '../../utils'

const k = getK('IconButton')

const IconButtonRoot = styled(ButtonBase)`
	text-align: center;
	flex: 0 0 auto;
	font-size: ${`${24 / 16}rem`};
	padding: 8px;
	border-radius: 50%;
	color: ${themeVariables.action.active};
	transition: background-color ${themeVariables.transition.shortest}
		${themeVariables.transition.easeInOut} 0ms;

	&.${k('notDisableRipple')} {
		&:hover {
			background-color: ${themeVariables.action.hover};
			@media (hover: none) {
				background-color: transparent;
			}
		}
	}
	&.${k('start')} {
		margin-left: -12px;
		&.${k('small')} {
			margin-left: -3px;
		}
	}
	&.${k('end')} {
		margin-right: -12px;
		&.${k('small')} {
			margin-right: -3px;
		}
	}

	&.${k('inherit')} {
		color: inherit;
	}

	&.${k('color')} {
		color: ${({ color }) => themeVariables[color].main};
		&.${k('notDisableRipple')} {
			&:hover {
				background-color: ${({ color }) =>
					`rgba(${themeVariables[color].mainRgb},${themeVariables.action.hoverOpacity})`};
				@media (hover: none) {
					background-color: transparent;
				}
			}
		}
	}

	&.${k('small')} {
		padding: 5px;
		font-size: ${`${18 / 16}rem`};
	}
	&.${k('large')} {
		padding: 12px;
		font-size: ${`${28 / 16}rem`};
	}
	&.${k('disabled')} {
		background-color: transparent;
		color: ${themeVariables.action.disabled};
	}
`

export type IconButtonProps = {
	children?: React.ReactNode
	color?: BaseColorType
	disabled?: boolean
	disableFocusRipple?: boolean
	/**
	 * If given, uses a negative margin to counteract the padding on one
	 * side (this is often helpful for aligning the left or right
	 * side of the icon with content above or below, without ruining the border
	 * size and shape).
	 * @default false
	 */
	edge?: 'start' | 'end' | false
	/**
	 * The size of the component.
	 * `small` is equivalent to the dense button styling.
	 * @default 'medium'
	 */
	size?: 'small' | 'medium' | 'large'
} & NativeJSXElementsWithoutRef<'button'>

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((p, ref) => {
	const {
		edge = false,
		children,
		color = 'default',
		disabled = false,
		disableFocusRipple = false,
		size = 'medium'
	} = p

	return withNativeElementProps(
		p,
		<IconButtonRoot
			className={cx(
				disabled && k('disabled'),
				!disableFocusRipple && k('notDisableRipple'),
				edge === 'end' && k('end'),
				edge === 'start' && k('start'),
				size === 'large' && k('large'),
				size === 'small' && k('small'),
				size === 'small' && k('small'),
				disabled && k('disabled')
			)}
			centerRipple
			focusRipple={!disableFocusRipple}
			disabled={disabled}
			ref={ref}
			color={color}
		>
			{children}
		</IconButtonRoot>
	)
})

export default IconButton
