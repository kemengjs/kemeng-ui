import { cx, styled } from '@linaria/atomic'
import {
	ButtonHTMLAttributes,
	DetailedHTMLProps,
	ElementType,
	FocusEvent,
	FocusEventHandler,
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
import TouchRipple, { TouchRippleProps } from './TouchRipple'
import { getK } from '../../utils/style'
import { mergeProps } from '../../utils/withDefaultProps'
import { withNativeElementProps } from '../../utils/nativeProps'
import { useForkRef } from '../../hooks/useForkRef'
import { useIsFocusVisible } from '../../hooks/useIsFocusVisible'
import { useEventCallback } from '../../hooks/useEventCallback'

export type ActionRef = Ref<{
	focusVisible: () => void
}>

type NativeButtonProps = DetailedHTMLProps<
	ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>

const k = getK('ButtonBase')

export type ButtonBaseProps = {
	disabled?: boolean
	disableRipple?: boolean
	disableTouchRipple?: boolean
	focusRipple?: boolean
	type?: 'submit' | 'reset' | 'button'
	children?: ReactNode
	touchRippleProps?: TouchRippleProps
	centerRipple?: boolean
	endIcon?: ReactNode
	startIcon?: ReactNode
	actionRef?: ActionRef
	onFocusVisible?: FocusEventHandler<any>
	component?: ElementType
} & NativeButtonProps

const defaultProps: ButtonBaseProps = {
	type: 'button',
	disabled: false,
	disableRipple: false,
	disableTouchRipple: false,
	focusRipple: false,
	centerRipple: false,
	tabIndex: 0,
	component: 'button'
}

const ButtonBaseRoot = styled.button<ButtonBaseProps>`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	position: relative;
	box-sizing: border-box;
	-webkit-tap-highlight-color: transparent;
	background-color: transparent;
	outline: 0px;
	border: 0px;
	margin: 0;
	border-radius: 0;
	padding: 0;
	cursor: pointer;
	user-select: none;
	vertical-align: middle;
	appearance: none;
	text-decoration: none;
	color: inherit;
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
`

const ButtonBase = forwardRef<HTMLButtonElement, ButtonBaseProps>((p, ref) => {
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
		onFocus,
		onKeyDown,
		disableTouchRipple,
		focusRipple,
		onKeyUp,
		touchRippleProps,
		centerRipple,
		onFocusVisible,
		actionRef,
		component
	} = props
	const buttonRef = useRef<HTMLButtonElement>(null)
	const disabled = propDisabled

	const rippleRef = useRef(null)
	const {
		isFocusVisibleRef,
		onFocus: handleFocusVisible,
		onBlur: handleBlurVisible,
		ref: focusVisibleRef
	} = useIsFocusVisible()

	const [focusVisible, setFocusVisible] = useState(false)
	if (disabled && focusVisible) {
		setFocusVisible(false)
	}

	const handleRef = useForkRef(ref, focusVisibleRef, buttonRef)

	useImperativeHandle(actionRef, () => ({
		focusVisible: () => {
			setFocusVisible(true)
			buttonRef.current.focus()
		}
	}))

	const [mountedState, setMountedState] = useState(false)
	useEffect(() => {
		setMountedState(true)
	}, [])

	const enableTouchRipple = mountedState && !disableRipple && !disabled

	useEffect(() => {
		if (focusVisible && focusRipple && !disableRipple && mountedState) {
			rippleRef.current.pulsate()
		}
	}, [disableRipple, focusRipple, focusVisible, mountedState])

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
			handleBlurVisible(event)
			if (isFocusVisibleRef.current === false) {
				setFocusVisible(false)
			}
			if (onBlur) {
				onBlur(event)
			}
		},
		false
	)

	const handleFocus = useEventCallback(
		(event: FocusEvent<HTMLButtonElement>) => {
			// Fix for https://github.com/facebook/react/issues/7769
			if (!buttonRef.current) {
				buttonRef.current = event.currentTarget
			}

			handleFocusVisible(event)
			if (isFocusVisibleRef.current === true) {
				setFocusVisible(true)

				if (onFocusVisible) {
					onFocusVisible(event)
				}
			}

			if (onFocus) {
				onFocus(event)
			}
		}
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

	return withNativeElementProps(
		props,
		<ButtonBaseRoot
			as={component}
			ref={handleRef}
			type={props.type}
			onBlur={handleBlur}
			onClick={onClick}
			onContextMenu={handleContextMenu}
			onFocus={handleFocus}
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
			tabIndex={disabled ? -1 : props.tabIndex}
			className={cx(disabled && k('disabled'))}
		>
			{props.children}
			{enableTouchRipple ? (
				/* TouchRipple is only needed client-side, x2 boost on the server. */
				<TouchRipple
					ref={rippleRef}
					center={centerRipple}
					{...touchRippleProps}
				/>
			) : null}
		</ButtonBaseRoot>
	)
})

export default ButtonBase
