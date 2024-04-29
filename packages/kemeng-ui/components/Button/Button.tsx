import {
	ButtonHTMLAttributes,
	DetailedHTMLProps,
	FocusEvent,
	KeyboardEvent,
	MouseEvent,
	ReactNode,
	Ref,
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState
} from 'react'
import { withNativeProps } from '../../utils/nativeProps'
import { mergeProps } from '../../utils/withDefaultProps'
import { cx, styled } from '@linaria/atomic'
import { BaseColorType, themeVariables } from '../../utils'
import TouchRipple, { TouchRippleProps } from './TouchRipple'
import { getK } from '../../utils/style'
import { useEventCallback } from '../../hooks/useEventCallback'
import { useForkRef } from '../../hooks/useForkRef'

export type ActionRef = Ref<{
	focusVisible: () => void
}>

type NativeButtonProps = DetailedHTMLProps<
	ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>

const k = getK('button')

export type ButtonProps = {
	color?: BaseColorType
	variant?: 'contained' | 'outlined' | 'text'
	size?: 'small' | 'medium' | 'large'
	disabled?: boolean
	disableRipple?: boolean
	disableTouchRipple?: boolean
	focusRipple?: boolean
	type?: 'submit' | 'reset' | 'button'
	children?: ReactNode
	touchRippleProps?: TouchRippleProps
	centerRipple?: boolean
	fullWidth?: boolean
	endIcon?: ReactNode
	startIcon?: ReactNode
	actionRef?: ActionRef
} & NativeButtonProps

const defaultProps: ButtonProps = {
	color: 'primary',
	variant: 'contained',
	type: 'button',
	size: 'medium',
	disabled: false,
	disableRipple: false,
	disableTouchRipple: false,
	focusRipple: true,
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

const ButtonRoot = styled.button<ButtonProps>`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	position: relative;
	box-sizing: border-box;
	-webkit-tap-highlight-color: transparent;
	outline: 0px;
	border: 0px;
	cursor: pointer;
	user-select: none;
	vertical-align: middle;
	appearance: none;
	text-decoration: none;
	&::-moz-focus-inner {
		border-style: none;
	}
	&.${k('disabled')} {
		pointer-events: none;
		cursor: default;
	}
	@media print {
		print-color-adjust: exact;
	}
	font-weight: 500;
	font-size: 0.875rem;
	line-height: 1.75;
	letter-spacing: 0.02857em;
	text-transform: uppercase;
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
		disableRipple,
		disabled: propDisabled,
		onMouseDown,
		onContextMenu,
		onDragLeave,
		onMouseUp,
		onMouseLeave,
		onTouchStart,
		onTouchEnd,
		onBlur,
		onTouchMove,
		onClick,
		color,
		onKeyDown,
		disableTouchRipple,
		focusRipple,
		onKeyUp,
		touchRippleProps,
		centerRipple,
		variant,
		size,
		startIcon,
		endIcon,
		actionRef,
		fullWidth,
		...other
	} = props
	const buttonRef = useRef<HTMLButtonElement>(null)
	const [mountedState, setMountedState] = useState(false)
	const disabled = propDisabled
	const enableTouchRipple = mountedState && !disableRipple && !disabled

	const rippleRef = useRef(null)

	const [focusVisible, setFocusVisible] = useState(false)
	if (disabled && focusVisible) {
		setFocusVisible(false)
	}

	const handleRef = useForkRef(ref, buttonRef)

	useImperativeHandle(actionRef, () => ({
		focusVisible: () => {
			setFocusVisible(true)
			buttonRef.current.focus()
		}
	}))

	useEffect(() => {
		setMountedState(true)
	}, [])

	function useRippleHandler(
		rippleAction: 'start' | 'stop',
		eventCallback: any,
		skipRippleAction = disableTouchRipple
	) {
		return useEventCallback(event => {
			if (eventCallback) {
				eventCallback(event)
			}

			const ignore = skipRippleAction
			if (!ignore && rippleRef.current) {
				rippleRef.current[rippleAction](event)
			}

			return true
		})
	}

	const handleMouseDown = useRippleHandler('start', onMouseDown)
	const handleContextMenu = useRippleHandler('stop', onContextMenu)
	const handleDragLeave = useRippleHandler('stop', onDragLeave)
	const handleMouseUp = useRippleHandler('stop', onMouseUp)
	const handleMouseLeave = useRippleHandler(
		'stop',
		(event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
			if (focusVisible) {
				event.preventDefault()
			}
			if (onMouseLeave) {
				onMouseLeave(event)
			}
		}
	)
	const handleTouchStart = useRippleHandler('start', onTouchStart)
	const handleTouchEnd = useRippleHandler('stop', onTouchEnd)
	const handleTouchMove = useRippleHandler('stop', onTouchMove)

	const handleBlur = useRippleHandler(
		'stop',
		(event: FocusEvent<HTMLButtonElement, Element>) => {
			setFocusVisible(false)
			if (onBlur) {
				onBlur(event)
			}
		},
		false
	)

	const keydownRef = useRef(false)
	const handleKeyDown = useEventCallback(
		(event: KeyboardEvent<HTMLButtonElement>) => {
			// Check if key is already down to avoid repeats being counted as multiple activations
			if (
				focusRipple &&
				!keydownRef.current &&
				focusVisible &&
				rippleRef.current &&
				event.key === ' '
			) {
				keydownRef.current = true
				rippleRef.current.stop(event, () => {
					rippleRef.current.start(event)
				})
			}

			if (event.target === event.currentTarget && event.key === ' ') {
				event.preventDefault()
			}

			if (onKeyDown) {
				onKeyDown(event)
			}

			// Keyboard accessibility for non interactive elements
			if (
				event.target === event.currentTarget &&
				event.key === 'Enter' &&
				!disabled
			) {
				event.preventDefault()
				if (onClick) {
					onClick(
						event as unknown as MouseEvent<
							HTMLButtonElement,
							globalThis.MouseEvent
						>
					)
				}
			}
		}
	)

	const handleKeyUp = useEventCallback(
		(event: KeyboardEvent<HTMLButtonElement>) => {
			// calling preventDefault in keyUp on a <button> will not dispatch a click event if Space is pressed
			// https://codesandbox.io/p/sandbox/button-keyup-preventdefault-dn7f0
			if (
				focusRipple &&
				event.key === ' ' &&
				rippleRef.current &&
				focusVisible &&
				!event.defaultPrevented
			) {
				keydownRef.current = false
				rippleRef.current.stop(event, () => {
					rippleRef.current.pulsate(event)
				})
			}
			if (onKeyUp) {
				onKeyUp(event)
			}

			// Keyboard accessibility for non interactive elements
			if (
				onClick &&
				event.target === event.currentTarget &&
				event.key === ' ' &&
				!event.defaultPrevented
			) {
				onClick(
					event as unknown as MouseEvent<
						HTMLButtonElement,
						globalThis.MouseEvent
					>
				)
			}
		}
	)

	return withNativeProps(
		props,
		<ButtonRoot
			ref={handleRef}
			type={props.type}
			onBlur={handleBlur}
			onClick={onClick}
			onContextMenu={handleContextMenu}
			onKeyDown={handleKeyDown}
			onKeyUp={handleKeyUp}
			onMouseDown={handleMouseDown}
			onMouseLeave={handleMouseLeave}
			onMouseUp={handleMouseUp}
			onDragLeave={handleDragLeave}
			onTouchEnd={handleTouchEnd}
			onTouchMove={handleTouchMove}
			onTouchStart={handleTouchStart}
			disabled={disabled}
			color={color}
			tabIndex={disabled ? -1 : props.tabIndex}
			{...other}
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
			{props.children}
			{endIcon && <ButtonEndIcon>{endIcon}</ButtonEndIcon>}
			{enableTouchRipple ? (
				/* TouchRipple is only needed client-side, x2 boost on the server. */
				<TouchRipple
					ref={rippleRef}
					center={centerRipple}
					{...touchRippleProps}
				/>
			) : null}
		</ButtonRoot>
	)
})

export default Button
