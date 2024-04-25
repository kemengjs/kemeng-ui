import {
	ButtonHTMLAttributes,
	DetailedHTMLProps,
	FocusEvent,
	KeyboardEvent,
	MouseEvent,
	MouseEventHandler,
	ReactNode,
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState
} from 'react'
import { NativeProps, withNativeProps } from '../../utils/nativeProps'
import { mergeProps } from '../../utils/withDefaultProps'
import { isPromise } from '../../utils/validate'
import { styled } from '@linaria/atomic'
import { BaseColorType, themeVariables } from '../../utils'
import TouchRipple, { TouchRippleProps } from './TouchRipple'
import { k } from '../../utils/style'
import { useEventCallback } from '../../hooks/useEventCallback'

export type ButtonRef = {
	nativeElement: HTMLButtonElement | null
	focusVisible: () => void
}

type NativeButtonProps = DetailedHTMLProps<
	ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>

type HandeClick = (
	event: MouseEvent<HTMLButtonElement, MouseEvent>
) => void | Promise<void> | unknown

export type ButtonProps = {
	color?: BaseColorType
	variant?: 'contained' | 'outline' | 'text'
	size?: 'mini' | 'small' | 'middle' | 'large'
	block?: boolean
	loading?: boolean | 'auto'
	loadingText?: string
	loadingIcon?: ReactNode
	disabled?: boolean
	disableRipple?: boolean
	disableTouchRipple?: boolean
	focusRipple?: boolean
	onClick?: HandeClick
	type?: 'submit' | 'reset' | 'button'
	shape?: 'default' | 'rounded' | 'rectangular'
	children?: ReactNode
	touchRippleProps?: TouchRippleProps
	centerRipple?: boolean
} & Omit<NativeButtonProps, 'onClick'> &
	NativeProps

const defaultProps: ButtonProps = {
	color: 'primary',
	variant: 'contained',
	block: false,
	loading: false,
	loadingIcon: '123',
	type: 'button',
	shape: 'default',
	size: 'middle',
	disabled: false,
	disableRipple: false,
	disableTouchRipple: false,
	focusRipple: true,
	centerRipple: false
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
		border-style: 'none';
	}
	&.${k('disabled')} {
		pointer-events: 'none';
		cursor: 'default';
	}
	@media print {
		print-color-adjust: 'exact';
	}
	font-weight: 500;
	font-size: 0.875rem;
	line-height: 1.75;
	letter-spacing: 0.02857em;
	text-transform: uppercase;
	min-width: 64px;
	padding: 6px 16px;
	border-radius: 4px;
	transition:
		background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
		box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
		border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
		color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
	color: ${({ color }) => themeVariables[color].contrastText};
	background-color: ${({ color }) => themeVariables[color].main};
	box-shadow:
		rgba(0, 0, 0, 0.2) 0px 3px 1px -2px,
		rgba(0, 0, 0, 0.14) 0px 2px 2px 0px,
		rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
	&:hover {
		background-color: ${({ color }) => themeVariables[color].dark};
		box-shadow:
			rgba(0, 0, 0, 0.2) 0px 2px 4px -1px,
			rgba(0, 0, 0, 0.14) 0px 4px 5px 0px,
			rgba(0, 0, 0, 0.12) 0px 1px 10px 0px;
	}
`

const Button = forwardRef<ButtonRef, ButtonProps>((p, ref) => {
	const props = mergeProps(defaultProps, p)
	const {
		loading: propLoading,
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
		...other
	} = props
	const [innerLoading, setInnerLoading] = useState(false)
	const nativeButtonRef = useRef<HTMLButtonElement>(null)
	const [mountedState, setMountedState] = useState(false)
	const loading = propLoading === 'auto' ? innerLoading : propLoading
	const disabled = propDisabled || loading
	const enableTouchRipple = mountedState && !disableRipple && !disabled

	const rippleRef = useRef(null)

	const [focusVisible, setFocusVisible] = useState(false)
	if (disabled && focusVisible) {
		setFocusVisible(false)
	}

	useImperativeHandle(ref, () => ({
		get nativeElement() {
			return nativeButtonRef.current
		},

		focusVisible: () => {
			setFocusVisible(true)
			nativeButtonRef.current.focus()
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

	const handleClick: HandeClick = async e => {
		if (!onClick) return

		const promise = onClick(e)

		if (isPromise(promise)) {
			try {
				setInnerLoading(true)
				await promise
				setInnerLoading(false)
			} catch (e) {
				setInnerLoading(false)
				throw e
			}
		}
	}

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
					onClick(event as unknown as MouseEvent<HTMLButtonElement, MouseEvent>)
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
				onClick(event as unknown as MouseEvent<HTMLButtonElement, MouseEvent>)
			}
		}
	)

	return withNativeProps(
		props,
		<ButtonRoot
			ref={nativeButtonRef}
			type={props.type}
			onBlur={handleBlur}
			onClick={handleClick as MouseEventHandler<HTMLButtonElement> & HandeClick}
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
			// className={classNames(
			// 	classPrefix,
			// 	{
			// 		[`${classPrefix}-${props.color}`]: props.color,
			// 		[`${classPrefix}-block`]: props.block,
			// 		[`${classPrefix}-disabled`]: disabled,
			// 		[`${classPrefix}-variant-outline`]: props.variant === 'outline',
			// 		[`${classPrefix}-variant-none`]: props.variant === 'none',
			// 		[`${classPrefix}-mini`]: props.size === 'mini',
			// 		[`${classPrefix}-small`]: props.size === 'small',
			// 		[`${classPrefix}-large`]: props.size === 'large',
			// 		[`${classPrefix}-loading`]: loading
			// 	},
			// 	`${classPrefix}-shape-${props.shape}`
			// )}
			disabled={disabled}
			color={color}
			{...other}
		>
			{/* {loading ? (
				<div className={`-loading-wrapper`}>
					{props.loadingIcon}
					{props.loadingText}
				</div>
			) : (
				<span>{props.children}</span>
			)} */}
			{props.children}
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
