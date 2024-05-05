import { cx, styled } from '@linaria/atomic'
import { BaseColorType, themeVariables } from '../../utils'
import { getK } from '../../utils/style'
import {
	ChangeEventHandler,
	ElementType,
	FocusEventHandler,
	FormEventHandler,
	HTMLAttributes,
	KeyboardEventHandler,
	MouseEventHandler,
	ReactNode,
	Ref,
	forwardRef,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react'
import { withNativeElementProps } from '../../utils/nativeProps'
import { useForkRef } from '../../hooks/useForkRef'
import formControlState from '../FormControl/formControlState'
import { useFormControl } from '../FormControl'
import { isFilled } from '../../utils/input'
import useEnhancedEffect from '../../hooks/useEnhancedEffect'
import TextareaAutosize from '../TextareaAutosize'
import FormControlContext from '../FormControl/FormControlContext'
import { useTheme } from '../ThemePrivder'

const k = getK('InputBase')

export const InputBaseRoot = styled.div`
	font-weight: ${themeVariables.typographyBody1.fontWeight};
	font-size: ${themeVariables.typographyBody1.fontSize};
	line-height: ${themeVariables.typographyBody1.lineHeight};
	letter-spacing: ${themeVariables.typographyBody1.letterSpacing};
	color: ${themeVariables.text.primary};
	line-height: 1.4375em;
	box-sizing: border-box;
	position: relative;
	cursor: text;
	display: inline-flex;
	align-items: center;

	&.${k('disabled')} {
		color: ${themeVariables.text.disabled};
		cursor: default;
	}
	&.${k('multiline')} {
		padding: 4px 0 5px;
		&.${k('small')} {
			padding-top: 1px;
		}
	}
	&.${k('fullWidth')} {
		width: 100%;
	}
`

export const InputBaseComponent = styled.input<InputBaseComponentProps>`
	font: inherit;
	letter-spacing: inherit;
	color: currentColor;
	padding: 4px 0 5px;
	border: 0;
	box-sizing: content-box;
	background: none;
	height: 1.4375em;
	margin: 0;
	-webkit-tap-highlight-color: transparent;
	display: block;
	min-width: 0;
	width: 100%;

	@keyframes kemengui-auto-fill {
		from {
			display: block;
		}
	}

	@keyframes kemengui-auto-fill-cancel {
		from {
			display: block;
		}
	}

	animation-name: kemengui-auto-fill-cancel;
	animation-duration: 10ms;

	&::-webkit-input-placeholder,
	&::-moz-placeholder,
	&:-ms-input-placeholder,
	&::-ms-input-placeholder {
		color: currentColor;
		opacity: ${({ light }) => {
			return light ? 0.42 : 0.5
		}};
		transition: ${({ transitionCss }) => transitionCss};
	}

	&:focus {
		outline: 0;
	}
	&:invalid {
		box-shadow: none;
	}
	&::-webkit-search-decoration {
		-webkit-appearance: none;
	}

	&.${k('disabled')} {
		opacity: 1;
		-webkit-text-fill-color: ${themeVariables.text.disabled};
	}

	&:-webkit-autofill {
		animation-duration: 5000s;
		animation-name: mui-auto-fill;
	}

	&.${k('small')} {
		padding-top: 1px;
	}

	&.${k('multiline')} {
		height: auto;
		resize: none;
		padding: 0;
		padding-top: 0;
	}

	&.${k('search')} {
		-moz-appearance: textfield;
	}
`
export type InputBaseComponentProps = HTMLAttributes<
	HTMLInputElement | HTMLTextAreaElement
> & { [arbitrary: string]: any }

export type InputBaseProps = {
	'aria-describedby'?: string
	autoComplete?: string
	autoFocus?: boolean
	color?: BaseColorType
	defaultValue?: string | number | readonly string[]
	disabled?: boolean
	endAdornment?: ReactNode
	error?: boolean
	fullWidth?: boolean
	id?: string
	inputComponent?: ElementType<InputBaseComponentProps>
	inputProps?: InputBaseComponentProps
	inputRef?: Ref<any>
	margin?: 'dense' | 'none'
	multiline?: boolean
	name?: string
	onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
	onChange?: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
	onFocus?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
	onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement | HTMLInputElement>
	onKeyUp?: KeyboardEventHandler<HTMLTextAreaElement | HTMLInputElement>
	onInvalid?: FormEventHandler<HTMLInputElement | HTMLTextAreaElement>
	placeholder?: string
	readOnly?: boolean
	required?: boolean
	renderSuffix?: (state: {
		disabled?: boolean
		error?: boolean
		filled?: boolean
		focused?: boolean
		margin?: 'dense' | 'none' | 'normal'
		required?: boolean
		startAdornment?: ReactNode
	}) => ReactNode
	rows?: string | number
	maxRows?: string | number
	minRows?: string | number
	size?: 'small' | 'medium'
	startAdornment?: ReactNode
	type?: string
	value?: unknown
} & Omit<
	HTMLAttributes<HTMLDivElement>,
	| 'children'
	| 'defaultValue'
	| 'onBlur'
	| 'onChange'
	| 'onFocus'
	| 'onInvalid'
	| 'onKeyDown'
	| 'onKeyUp'
>

const InputBase = forwardRef<HTMLDivElement, InputBaseProps>((p, ref) => {
	const { theme, createTransition } = useTheme()
	const light = theme.mode === 'light'
	const transitionCss = createTransition('opacity', {
		duration: theme.transition.shorter
	})

	const {
		'aria-describedby': ariaDescribedby,
		autoComplete,
		autoFocus,
		defaultValue,
		disabled,
		endAdornment,
		fullWidth = false,
		id,
		inputComponent = 'input',
		inputProps: inputPropsProp = {},
		inputRef: inputRefProp,
		maxRows,
		minRows,
		multiline = false,
		name,
		onBlur,
		onChange,
		onClick,
		onFocus,
		onKeyDown,
		onKeyUp,
		placeholder,
		readOnly,
		renderSuffix,
		rows,
		size,
		startAdornment,
		type = 'text',
		value: valueProp
	} = p

	const value = inputPropsProp.value != null ? inputPropsProp.value : valueProp
	const { current: isControlled } = useRef(value != null)

	const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null)
	const handleInputRefWarning = useCallback((instance: HTMLElement) => {
		if (process.env.NODE_ENV !== 'production') {
			if (instance && instance.nodeName !== 'INPUT' && !instance.focus) {
				console.error(
					[
						'You have provided a `inputComponent` to the input component',
						'that does not correctly handle the `ref` prop.',
						'Make sure the `ref` prop is called with a HTMLInputElement.'
					].join('\n')
				)
			}
		}
	}, [])

	const handleInputRef = useForkRef(
		inputRef,
		inputRefProp,
		inputPropsProp.ref,
		handleInputRefWarning
	)

	const [focused, setFocused] = useState(false)
	const formControl = useFormControl()

	const fcs = formControlState({
		props: p,
		formControl,
		states: [
			'color',
			'disabled',
			'error',
			'hiddenLabel',
			'size',
			'required',
			'filled'
		]
	})

	fcs.focused = formControl ? formControl.focused : focused

	// The blur won't fire when the disabled state is set on a focused input.
	// We need to book keep the focused state manually.
	useEffect(() => {
		if (!formControl && disabled && focused) {
			setFocused(false)
			if (onBlur) {
				// @ts-ignore
				onBlur()
			}
		}
	}, [formControl, disabled, focused, onBlur])

	const onFilled = formControl && formControl.onFilled
	const onEmpty = formControl && formControl.onEmpty

	const checkDirty = useCallback(
		obj => {
			if (isFilled(obj)) {
				if (onFilled) {
					onFilled()
				}
			} else if (onEmpty) {
				onEmpty()
			}
		},
		[onFilled, onEmpty]
	)

	useEnhancedEffect(() => {
		if (isControlled) {
			checkDirty({ value })
		}
	}, [value, checkDirty, isControlled])

	const handleFocus = event => {
		// Fix a bug with IE11 where the focus/blur events are triggered
		// while the component is disabled.
		if (fcs.disabled) {
			event.stopPropagation()
			return
		}

		if (onFocus) {
			onFocus(event)
		}
		if (inputPropsProp.onFocus) {
			inputPropsProp.onFocus(event)
		}

		if (formControl && formControl.onFocus) {
			formControl.onFocus(event)
		} else {
			setFocused(true)
		}
	}

	const handleBlur: FocusEventHandler<HTMLInputElement> &
		FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> = event => {
		if (onBlur) {
			onBlur(event)
		}
		if (inputPropsProp.onBlur) {
			inputPropsProp.onBlur(event)
		}

		if (formControl && formControl.onBlur) {
			formControl.onBlur(event)
		} else {
			setFocused(false)
		}
	}

	const handleChange: ChangeEventHandler<
		HTMLTextAreaElement | HTMLInputElement
	> = (event, ...args) => {
		if (!isControlled) {
			const element = event.target || inputRef.current
			if (element == null) {
				throw new Error(
					'Expected valid input target. ' +
						'Did you use a custom `inputComponent` and forget to forward refs? ' +
						'See https://mui.com/r/input-component-ref-interface for more info.'
				)
			}

			checkDirty({
				value: element.value
			})
		}

		if (inputPropsProp.onChange) {
			inputPropsProp.onChange(event, ...args)
		}

		// Perform in the willUpdate
		if (onChange) {
			onChange(event, ...args)
		}
	}

	// Check the input state on mount, in case it was filled by the user
	// or auto filled by the browser before the hydration (for SSR).
	useEffect(() => {
		checkDirty(inputRef.current)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleClick: MouseEventHandler<HTMLDivElement> = event => {
		if (inputRef.current && event.currentTarget === event.target) {
			inputRef.current.focus()
		}

		if (onClick) {
			onClick(event)
		}
	}
	let InputComponent = inputComponent
	let inputProps = inputPropsProp

	if (multiline && InputComponent === 'input') {
		if (rows) {
			if (process.env.NODE_ENV !== 'production') {
				if (minRows || maxRows) {
					console.warn(
						'You can not use the `minRows` or `maxRows` props when the input `rows` prop is set.'
					)
				}
			}
			inputProps = {
				type: undefined,
				minRows: rows,
				maxRows: rows,
				...inputProps
			}
		} else {
			inputProps = {
				type: undefined,
				maxRows,
				minRows,
				...inputProps
			}
		}

		InputComponent = TextareaAutosize
	}

	const handleAutoFill = event => {
		// Provide a fake value as Chrome might not let you access it for security reasons.
		checkDirty(
			event.animationName === 'mui-auto-fill-cancel'
				? inputRef.current
				: { value: 'x' }
		)
	}

	useEffect(() => {
		if (formControl) {
			formControl.setAdornedStart(Boolean(startAdornment))
		}
	}, [formControl, startAdornment])

	return withNativeElementProps(
		p,
		<InputBaseRoot
			ref={ref}
			onClick={handleClick}
			className={cx(
				readOnly && 'kemenguiInputBase-readOnly',
				disabled && k('disabled'),
				multiline && k('multiline'),
				fullWidth && k('fullWidth')
			)}
		>
			{startAdornment}
			<FormControlContext.Provider value={null}>
				<InputBaseComponent
					aria-invalid={fcs.error}
					aria-describedby={ariaDescribedby}
					autoComplete={autoComplete}
					autoFocus={autoFocus}
					defaultValue={defaultValue}
					disabled={fcs.disabled}
					id={id}
					onAnimationStart={handleAutoFill}
					name={name}
					placeholder={placeholder}
					readOnly={readOnly}
					required={fcs.required}
					rows={rows}
					value={value}
					onKeyDown={onKeyDown}
					onKeyUp={onKeyUp}
					type={type}
					{...inputProps}
					as={InputComponent}
					ref={handleInputRef}
					className={cx(
						readOnly && 'kemenguiInputBase-readOnly',
						disabled && k('disabled'),
						multiline && k('multiline'),
						type === 'search' && k('search'),
						size === 'small' && k('small'),
						!!formControl && k('formControl'),
						inputProps.className
					)}
					onBlur={handleBlur}
					onChange={handleChange}
					onFocus={handleFocus}
					light={light}
					transitionCss={transitionCss}
				/>
			</FormControlContext.Provider>
			{endAdornment}
			{renderSuffix
				? renderSuffix({
						...fcs,
						startAdornment
					})
				: null}
		</InputBaseRoot>
	)
})

export default InputBase
