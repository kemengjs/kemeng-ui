import {
	ButtonHTMLAttributes,
	DetailedHTMLProps,
	ReactNode,
	forwardRef
} from 'react'
import { withNativeElementProps } from '../../utils/nativeProps'
import { mergeProps } from '../../utils/withDefaultProps'
import { cx, styled } from '@linaria/atomic'
import { BaseColorType, themeVariables } from '../../utils'
import { TouchRippleProps } from './TouchRipple'
import { getK } from '../../utils/style'
import ButtonBase from './ButtonBase'

type NativeButtonProps = DetailedHTMLProps<
	ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>

const k = getK('Button')

export type ButtonProps = {
	color?: BaseColorType
	variant?: 'contained' | 'outlined' | 'text'
	size?: 'small' | 'medium' | 'large'
	disabled?: boolean
	disableRipple?: boolean
	disableTouchRipple?: boolean
	disableFocusRipple?: boolean
	type?: 'submit' | 'reset' | 'button'
	children?: ReactNode
	touchRippleProps?: TouchRippleProps
	centerRipple?: boolean
	fullWidth?: boolean
	endIcon?: ReactNode
	startIcon?: ReactNode
	focusVisibleClassName?: string
} & NativeButtonProps

const defaultProps: ButtonProps = {
	disableFocusRipple: false,
	color: 'primary',
	variant: 'contained',
	type: 'button',
	size: 'medium',
	disabled: false,
	disableTouchRipple: false,
	centerRipple: false
}

const getSizeStyles = (small: string, large: string) => {
	return {
		[`&.${k('small')}`]: {
			padding: small,
			fontSize: `${13 / 16}rem`
		},
		[`&.${k('large')}`]: {
			padding: large,
			fontSize: `${15 / 16}rem`
		}
	}
}

const ButtonRoot = styled(ButtonBase)<ButtonProps>`
	font-weight: ${themeVariables.typographyButton.fontWeight};
	font-size: ${themeVariables.typographyButton.fontSize};
	line-height: ${themeVariables.typographyButton.lineHeight};
	letter-spacing: ${themeVariables.typographyButton.letterSpacing};
	min-width: 64px;
	padding: 6px 16px;
	border-radius: ${themeVariables.shape.borderRadius};
	transition:
		background-color ${themeVariables.transition.short}
			${themeVariables.transition.easeInOut} 0ms,
		box-shadow ${themeVariables.transition.short}
			${themeVariables.transition.easeInOut} 0ms,
		border-color ${themeVariables.transition.short}
			${themeVariables.transition.easeInOut} 0ms,
		color ${themeVariables.transition.short}
			${themeVariables.transition.easeInOut} 0ms;

	&.${k('contained')} {
		color: ${({ color }) => themeVariables[color].contrastText};
		background-color: ${({ color }) => themeVariables[color].main};
		box-shadow: ${themeVariables.shadows[2]};
		&:hover {
			background-color: ${({ color }) => themeVariables[color].dark};
			box-shadow: ${themeVariables.shadows[4]};
			@media (hover: none) {
				box-shadow: ${themeVariables.shadows[2]};
			}
		}

		&:active {
			box-shadow: ${themeVariables.shadows[8]};
		}

		&.${k('disabled')} {
			box-shadow: ${themeVariables.shadows[0]};
			background-color: ${themeVariables.action.disabledBackground};
			color: ${themeVariables.action.disabled};
		}
		&.${k('focusVisible')} {
			box-shadow: ${themeVariables.shadows[6]};
		}
		${getSizeStyles('4px 10px', '8px 22px')}
	}

	&.${k('outlined')} {
		padding: 5px 15px;
		border: 1px solid currentColor;
		background-color: transparent;
		color: ${({ color }) => themeVariables[color].main};

		&:hover {
			background-color: ${({ color }) =>
				`rgba(${themeVariables[color].mainRgb},${themeVariables.action.hoverOpacity})`};
		}

		&.${k('disabled')} {
			border: 1px solid ${themeVariables.action.disabledBackground};
		}
		${getSizeStyles('3px 9px', '7px 21px')}
	}

	&.${k('text')} {
		padding: 6px 8px;
		color: ${({ color }) => themeVariables[color].main};
		background-color: transparent;
		&:hover {
			background-color: ${({ color }) =>
				`rgba(${themeVariables[color].mainRgb},${themeVariables.action.hoverOpacity})`};
		}

		${getSizeStyles('4px 5px', '8px 11px')}
	}

	&.${k('disabled')} {
		color: ${themeVariables.action.disabled};
	}

	&.${k('fullWidth')} {
		width: 100%;
	}
`

const commonIconStyles = {
	[`&.${k('iconSmall')} > *:nth-of-type(1)`]: {
		fontSize: '18px'
	},
	[`&.${k('iconMedium')} > *:nth-of-type(1)`]: {
		fontSize: '20px'
	},
	[`&.${k('iconLarge')} > *:nth-of-type(1)`]: {
		fontSize: '22px'
	}
}

const ButtonStartIcon = styled.span`
	display: inherit;
	margin-right: 8px;
	margin-left: -4px;

	&.${k('iconSmall')} {
		margin-left: -2px;
	}
	${commonIconStyles}
`
const ButtonEndIcon = styled.span`
	display: inherit;
	margin-right: -4px;
	margin-left: 8px;

	&.${k('iconSmall')} {
		margin-right: -2px;
	}
	${commonIconStyles}
`

const Button = forwardRef<HTMLButtonElement, ButtonProps>((p, ref) => {
	const props = mergeProps(defaultProps, p)
	const {
		disabled,
		disableFocusRipple,
		color,
		focusVisibleClassName,
		variant,
		size,
		startIcon,
		endIcon,
		children,
		fullWidth
	} = props

	return withNativeElementProps(
		props,
		<ButtonRoot
			ref={ref}
			type={props.type}
			disabled={disabled}
			focusRipple={!disableFocusRipple}
			focusVisibleClassName={cx(k('focusVisible'), focusVisibleClassName)}
			color={color}
			className={cx(
				disabled && k('disabled'),
				variant === 'contained'
					? k('contained')
					: variant === 'text'
						? k('text')
						: k('outlined'),
				size === 'medium' ? '' : size === 'large' ? k('large') : k('small'),
				fullWidth && k('fullWidth')
			)}
		>
			{startIcon && <ButtonStartIcon>{startIcon}</ButtonStartIcon>}
			{children}
			{endIcon && <ButtonEndIcon>{endIcon}</ButtonEndIcon>}
		</ButtonRoot>
	)
})

export default Button
