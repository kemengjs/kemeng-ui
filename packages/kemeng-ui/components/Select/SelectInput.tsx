import { cx, styled } from '@linaria/atomic'
import { getK } from '../../utils/style'
import {
	getNativeSelectSelectStyles,
	getNativeSelectIconStyles
} from '../NativeSelect/NativeSelectInput'
import {
	ChangeEvent,
	ChangeEventHandler,
	Children,
	ElementType,
	FocusEventHandler,
	HTMLAttributes,
	KeyboardEventHandler,
	MouseEvent,
	MouseEventHandler,
	ReactElement,
	ReactNode,
	SyntheticEvent,
	cloneElement,
	forwardRef,
	isValidElement,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState
} from 'react'
import useControlled from '../../hooks/useControlled'
import { useForkRef } from '../../hooks/useForkRef'
import Menu, { MenuProps } from '../Menu'
import { isFilled } from '../../utils/input'
import { ownerDocument } from '../../utils/ownerDocument'
import { NativeJSXElementsWithoutRef } from '../../utils/nativeProps'
import { useId } from '../../hooks/useId'
import { useTheme } from '../ThemePrivder'

const k = getK('Select')

const NativeSelectSelectStyles = getNativeSelectSelectStyles(k)

type SelectSelectProps = {
	light?: boolean
}
const SelectSelect = styled.div<SelectSelectProps>`
	${NativeSelectSelectStyles};

	&:focus {
		background-color: ${({ light }) =>
			light ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)'};
	}

	&.${k('select')} {
		height: auto;
		min-height: 1.4375em;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
`

const nativeSelectIconStyles = getNativeSelectIconStyles(k)
const SelectIcon = styled.svg`
	${nativeSelectIconStyles}
`
const SelectNativeInput = styled.input`
	bottom: 0;
	left: 0;
	position: absolute;
	opacity: 0;
	pointer-events: none;
	width: 100%;
	box-sizing: border-box;
`

function areEqualValues(a: any, b: any) {
	if (typeof b === 'object' && b !== null) {
		return a === b
	}

	// The value could be a number, the DOM will stringify it anyway.
	return String(a) === String(b)
}

function isEmpty(display: null | string | ReactNode) {
	return display == null || (typeof display === 'string' && !display.trim())
}

export type SelectChangeEvent<Value = string> =
	| (Event & { target: { value: Value; name: string } })
	| ChangeEvent<HTMLInputElement>

export type SelectInputProps<Value = unknown> = {
	autoFocus?: boolean
	autoWidth: boolean
	defaultOpen?: boolean
	disabled?: boolean
	error?: boolean
	IconComponent?: ElementType
	inputRef?: (
		ref:
			| HTMLSelectElement
			| {
					node?: HTMLInputElement
					value?: SelectInputProps<Value>['value']
					focus?: () => void
			  }
	) => void
	MenuProps?: Partial<MenuProps>
	multiple: boolean
	name?: string
	native: boolean
	onBlur?: FocusEventHandler<any>
	onChange?: (event: SelectChangeEvent<Value>, child: ReactNode) => void
	onClose?: (event: SyntheticEvent) => void
	onFocus?: FocusEventHandler<any>
	onOpen?: (event: SyntheticEvent) => void
	open?: boolean
	readOnly?: boolean
	renderValue?: (value: SelectInputProps<Value>['value']) => ReactNode
	SelectDisplayProps?: HTMLAttributes<HTMLDivElement>
	tabIndex?: number
	value?: Value
	displayEmpty?: boolean
	labelId?: string
	variant?: 'standard' | 'outlined' | 'filled'
	nativeInputClassName?: string
	iconClassName?: string
} & NativeJSXElementsWithoutRef<'input'>

const SelectInput = forwardRef<HTMLInputElement, SelectInputProps>((p, ref) => {
	const {
		'aria-describedby': ariaDescribedby,
		'aria-label': ariaLabel,
		autoFocus,
		autoWidth,
		children,
		className,
		defaultOpen,
		defaultValue,
		disabled,
		displayEmpty,
		error = false,
		IconComponent,
		inputRef: inputRefProp,
		labelId,
		MenuProps = {},
		multiple,
		name,
		onBlur,
		onChange,
		onClose,
		onFocus,
		onOpen,
		open: openProp,
		readOnly,
		renderValue,
		SelectDisplayProps = {},
		tabIndex: tabIndexProp,
		type,
		value: valueProp,
		variant = 'standard',
		nativeInputClassName,
		iconClassName,
		...other
	} = p

	const { theme } = useTheme()

	const [value, setValueState] = useControlled({
		controlled: valueProp,
		default: defaultValue
	})
	const [openState, setOpenState] = useControlled({
		controlled: openProp,
		default: defaultOpen
	})

	const inputRef = useRef(null)
	const displayRef = useRef(null)
	const [displayNode, setDisplayNode] = useState(null)
	const { current: isOpenControlled } = useRef(openProp != null)
	const [menuMinWidthState, setMenuMinWidthState] = useState()
	// @ts-ignore
	const handleRef = useForkRef(inputRefProp, ref)

	const handleDisplayRef = useCallback((node: HTMLElement) => {
		displayRef.current = node

		if (node) {
			setDisplayNode(node)
		}
	}, [])

	const anchorElement = displayNode?.parentNode

	useImperativeHandle(
		handleRef,
		() => ({
			focus: () => {
				displayRef.current.focus()
			},
			node: inputRef.current,
			value
		}),
		[value]
	)

	// Resize menu on `defaultOpen` automatic toggle.
	useEffect(() => {
		if (defaultOpen && openState && displayNode && !isOpenControlled) {
			setMenuMinWidthState(autoWidth ? null : anchorElement.clientWidth)
			displayRef.current.focus()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [displayNode, autoWidth])
	// `isOpenControlled` is ignored because the component should never switch between controlled and uncontrolled modes.
	// `defaultOpen` and `openState` are ignored to avoid unnecessary callbacks.
	useEffect(() => {
		if (autoFocus) {
			displayRef.current.focus()
		}
	}, [autoFocus])

	useEffect(() => {
		if (!labelId) {
			return undefined
		}
		const label = ownerDocument(displayRef.current).getElementById(labelId)
		if (label) {
			const handler = () => {
				if (getSelection().isCollapsed) {
					displayRef.current.focus()
				}
			}
			label.addEventListener('click', handler)
			return () => {
				label.removeEventListener('click', handler)
			}
		}
		return undefined
	}, [labelId])

	const update = (open: boolean, event: any) => {
		if (open) {
			if (onOpen) {
				onOpen(event)
			}
		} else if (onClose) {
			onClose(event)
		}

		if (!isOpenControlled) {
			setMenuMinWidthState(autoWidth ? null : anchorElement.clientWidth)
			setOpenState(open)
		}
	}

	const handleMouseDown: MouseEventHandler<HTMLDivElement> = event => {
		// Ignore everything but left-click
		if (event.button !== 0) {
			return
		}
		// Hijack the default focus behavior.
		event.preventDefault()
		displayRef.current.focus()

		update(true, event)
	}

	const handleClose: MenuProps['onClose'] = event => {
		update(false, event)
	}

	const childrenArray = Children.toArray(children)

	// Support autofill.
	const handleChange: ChangeEventHandler<HTMLInputElement> = event => {
		const child = childrenArray.find(
			childItem =>
				(childItem as ReactElement).props.value === event.target.value
		) as ReactElement

		if (child === undefined) {
			return
		}

		setValueState(child.props.value)

		if (onChange) {
			onChange(event, child)
		}
	}

	const handleItemClick =
		(child: ReactElement) => (event: MouseEvent<HTMLElement>) => {
			let newValue: string[]

			// We use the tabindex attribute to signal the available options.
			if (!event.currentTarget.hasAttribute('tabindex')) {
				return
			}

			if (multiple) {
				newValue = Array.isArray(value) ? value.slice() : []
				const itemIndex = (value as string | readonly string[]).indexOf(
					child.props.value
				)
				if (itemIndex === -1) {
					newValue.push(child.props.value)
				} else {
					newValue.splice(itemIndex, 1)
				}
			} else {
				newValue = child.props.value
			}

			if (child.props.onClick) {
				child.props.onClick(event)
			}

			if (value !== newValue) {
				setValueState(newValue)

				if (onChange) {
					// Redefine target to allow name and value to be read.
					// This allows seamless integration with the most popular form libraries.
					// https://github.com/mui/material-ui/issues/13485#issuecomment-676048492
					// Clone the event to not override `target` of the original event.
					const nativeEvent = event.nativeEvent || event
					// @ts-ignore
					const clonedEvent = new nativeEvent.constructor(
						nativeEvent.type,
						nativeEvent
					)

					Object.defineProperty(clonedEvent, 'target', {
						writable: true,
						value: { value: newValue, name }
					})
					onChange(clonedEvent, child)
				}
			}

			if (!multiple) {
				update(false, event)
			}
		}

	const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = event => {
		if (!readOnly) {
			const validKeys = [
				' ',
				'ArrowUp',
				'ArrowDown',
				// The native select doesn't respond to enter on macOS, but it's recommended by
				// https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/
				'Enter'
			]

			if (validKeys.indexOf(event.key) !== -1) {
				event.preventDefault()
				update(true, event)
			}
		}
	}

	const open = displayNode !== null && openState

	const handleBlur: FocusEventHandler<HTMLDivElement> = event => {
		// if open event.stopImmediatePropagation
		if (!open && onBlur) {
			// Preact support, target is read only property on a native event.
			Object.defineProperty(event, 'target', {
				writable: true,
				value: { value, name }
			})
			onBlur(event)
		}
	}

	delete other['aria-invalid']

	let display: ReactNode
	let displaySingle: ReactNode
	const displayMultiple = []
	let computeDisplay = false

	// No need to display any value if the field is empty.
	if (isFilled({ value }) || displayEmpty) {
		if (renderValue) {
			display = renderValue(value)
		} else {
			computeDisplay = true
		}
	}

	const items = childrenArray.map(child => {
		if (!isValidElement(child)) {
			return null
		}

		let selected: any

		if (multiple) {
			if (!Array.isArray(value)) {
				throw new Error(
					'MUI: The `value` prop must be an array ' +
						'when using the `Select` component with `multiple`.'
				)
			}

			selected = value.some(v => areEqualValues(v, child.props.value))
			if (selected && computeDisplay) {
				displayMultiple.push(child.props.children)
			}
		} else {
			selected = areEqualValues(value, child.props.value)
			if (selected && computeDisplay) {
				displaySingle = child.props.children
			}
		}

		return cloneElement(child as ReactElement, {
			'aria-selected': selected ? 'true' : 'false',
			onClick: handleItemClick(child),
			onKeyUp: (event: KeyboardEvent) => {
				if (event.key === ' ') {
					// otherwise our MenuItems dispatches a click event
					// it's not behavior of the native <option> and causes
					// the select to close immediately since we open on space keydown
					event.preventDefault()
				}

				if (child.props.onKeyUp) {
					child.props.onKeyUp(event)
				}
			},
			role: 'option',
			selected,
			value: undefined, // The value is most likely not a valid HTML attribute.
			'data-value': child.props.value // Instead, we provide it as a data attribute.
		})
	})

	if (computeDisplay) {
		if (multiple) {
			if (displayMultiple.length === 0) {
				display = null
			} else {
				display = displayMultiple.reduce((output, child, index) => {
					output.push(child)
					if (index < displayMultiple.length - 1) {
						output.push(', ')
					}
					return output
				}, [])
			}
		} else {
			display = displaySingle
		}
	}

	// Avoid performing a layout computation in the render method.
	let menuMinWidth = menuMinWidthState

	if (!autoWidth && isOpenControlled && displayNode) {
		menuMinWidth = anchorElement.clientWidth
	}

	let tabIndex
	if (typeof tabIndexProp !== 'undefined') {
		tabIndex = tabIndexProp
	} else {
		tabIndex = disabled ? null : 0
	}

	const buttonId =
		SelectDisplayProps.id ||
		(name ? `kemengui-component-select-${name}` : undefined)

	const paperProps = {
		...MenuProps.PaperProps
	}

	const listboxId = useId()

	return (
		<>
			<SelectSelect
				ref={handleDisplayRef}
				tabIndex={tabIndex}
				role='combobox'
				aria-controls={listboxId}
				aria-disabled={disabled ? 'true' : undefined}
				aria-expanded={open ? 'true' : 'false'}
				aria-haspopup='listbox'
				aria-label={ariaLabel}
				aria-labelledby={
					[labelId, buttonId].filter(Boolean).join(' ') || undefined
				}
				aria-describedby={ariaDescribedby}
				onKeyDown={handleKeyDown}
				onMouseDown={disabled || readOnly ? null : handleMouseDown}
				onBlur={handleBlur}
				onFocus={onFocus}
				{...SelectDisplayProps}
				className={cx(
					disabled && k('disabled'),
					variant === 'filled' && k('filled'),
					variant === 'outlined' && k('outlined'),
					className
				)}
				// The id is required for proper a11y
				id={buttonId}
				light={theme.mode === 'light'}
			>
				{/* So the vertical align positioning algorithm kicks in. */}
				{isEmpty(display) ? (
					// notranslate needed while Google Translate will not fix zero-width space issue
					<span className='notranslate'>&#8203;</span>
				) : (
					display
				)}
			</SelectSelect>
			<SelectNativeInput
				aria-invalid={error}
				value={Array.isArray(value) ? value.join(',') : value}
				name={name}
				ref={inputRef}
				aria-hidden
				onChange={handleChange}
				tabIndex={-1}
				disabled={disabled}
				className={cx(nativeInputClassName)}
				autoFocus={autoFocus}
				{...other}
			/>
			<SelectIcon
				as={IconComponent}
				className={cx(
					disabled && k('disabled'),
					variant === 'filled' && k('filled'),
					variant === 'outlined' && k('outlined'),
					open && k('open'),
					iconClassName
				)}
			/>
			<Menu
				id={`menu-${name || ''}`}
				anchorEl={anchorElement}
				open={open}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center'
				}}
				{...MenuProps}
				MenuListProps={{
					'aria-labelledby': labelId,
					role: 'listbox',
					'aria-multiselectable': multiple ? 'true' : undefined,
					disableListWrap: true,
					id: listboxId,
					...MenuProps.MenuListProps
				}}
				PaperProps={{
					...paperProps,
					style: {
						minWidth: menuMinWidth,
						...(paperProps != null ? paperProps.style : null)
					}
				}}
			>
				{items}
			</Menu>
		</>
	)
})

export default SelectInput
