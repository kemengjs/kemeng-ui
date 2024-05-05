import {
	Children,
	ElementType,
	ReactNode,
	forwardRef,
	useMemo,
	useRef,
	useState
} from 'react'
import FormControlContext from './FormControlContext'
import { cx, styled } from '@linaria/atomic'
import { getK, unit } from '../../utils/style'
import { BaseColorType } from '../../utils'
import { NativeJSXElementsWithoutRef } from '../../utils/nativeProps'
import isKemenguiElement from '../../utils/isKemenguiElement'
import { isAdornedStart, isFilled } from '../../utils/input'

const k = getK('FormControl')

const FormControlRoot = styled.div`
	display: inline-flex;
	flex-direction: column;
	position: relative;
	min-width: 0;
	padding: 0;
	margin: 0;
	border: 0;
	vertical-align: top;
	&.${k('normal')} {
		margin-top: ${unit(2)};
		margin-bottom: ${unit(1)};
	}
	&.${k('dense')} {
		margin-top: ${unit(1)};
		margin-bottom: ${unit(0.5)};
	}
	&.${k('fullWidth')} {
		width: 100%;
	}
`

export type FormControlProps = {
	children?: ReactNode
	color?: BaseColorType
	disabled?: boolean
	error?: boolean
	fullWidth?: boolean
	focused?: boolean
	hiddenLabel?: boolean
	margin?: 'dense' | 'normal' | 'none'
	required?: boolean
	size?: 'small' | 'medium'
	component?: ElementType
	/**
	 * The variant to use.
	 * @default 'outlined'
	 */
	variant?: 'standard' | 'outlined' | 'filled'
} & NativeJSXElementsWithoutRef<'div'>

const FormControl = forwardRef<HTMLDivElement, FormControlProps>((p, ref) => {
	const {
		children,
		className,
		color = 'primary',
		component = 'div',
		disabled = false,
		error = false,
		focused: visuallyFocused,
		fullWidth = false,
		hiddenLabel = false,
		margin = 'none',
		required = false,
		size = 'medium',
		variant = 'outlined',
		...other
	} = p

	const [adornedStart, setAdornedStart] = useState(() => {
		// We need to iterate through the children and find the Input in order
		// to fully support server-side rendering.
		let initialAdornedStart = false

		if (children) {
			Children.forEach(children, child => {
				if (!isKemenguiElement(child, ['Input', 'Select'])) {
					return
				}

				const input = isKemenguiElement(child, ['Select'])
					? // @ts-ignore
						child.props.input
					: child

				if (input && isAdornedStart(input.props)) {
					initialAdornedStart = true
				}
			})
		}
		return initialAdornedStart
	})

	const [filled, setFilled] = useState(() => {
		// We need to iterate through the children and find the Input in order
		// to fully support server-side rendering.
		let initialFilled = false

		if (children) {
			Children.forEach(children, child => {
				if (!isKemenguiElement(child, ['Input', 'Select'])) {
					return
				}

				if (
					// @ts-ignore
					isFilled(child.props, true) ||
					// @ts-ignore
					isFilled(child.props.inputProps, true)
				) {
					initialFilled = true
				}
			})
		}

		return initialFilled
	})

	const [focusedState, setFocused] = useState(false)
	if (disabled && focusedState) {
		setFocused(false)
	}

	const focused =
		visuallyFocused !== undefined && !disabled ? visuallyFocused : focusedState

	let registerEffect
	if (process.env.NODE_ENV !== 'production') {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const registeredInput = useRef(false)
		registerEffect = () => {
			if (registeredInput.current) {
				console.error(
					[
						'MUI: There are multiple `InputBase` components inside a FormControl.',
						'This creates visual inconsistencies, only use one `InputBase`.'
					].join('\n')
				)
			}

			registeredInput.current = true
			return () => {
				registeredInput.current = false
			}
		}
	}

	const childContext = useMemo(() => {
		return {
			adornedStart,
			setAdornedStart,
			color,
			disabled,
			error,
			filled,
			focused,
			fullWidth,
			hiddenLabel,
			size,
			onBlur: () => {
				setFocused(false)
			},
			onEmpty: () => {
				setFilled(false)
			},
			onFilled: () => {
				setFilled(true)
			},
			onFocus: () => {
				setFocused(true)
			},
			registerEffect,
			required,
			variant
		}
	}, [
		adornedStart,
		color,
		disabled,
		error,
		filled,
		focused,
		fullWidth,
		hiddenLabel,
		registerEffect,
		required,
		size,
		variant
	])

	return (
		<FormControlContext.Provider value={childContext}>
			<FormControlRoot
				as={component}
				className={cx(
					margin === 'normal' && k('normal'),
					margin === 'dense' && k('dense'),
					fullWidth && k('fullWidth'),
					className
				)}
				ref={ref}
				{...other}
			>
				{children}
			</FormControlRoot>
		</FormControlContext.Provider>
	)
})

export default FormControl
