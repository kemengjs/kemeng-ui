import {
	ElementType,
	HTMLAttributes,
	ReactElement,
	ReactNode,
	SyntheticEvent,
	cloneElement,
	forwardRef
} from 'react'
import Input, { InputProps } from '../Input'
import { MenuProps } from '../Menu'
import SelectInput, { SelectInputProps } from './SelectInput'
import ArrowDropDown from '../../svg/ArrowDropDown'
import NativeSelectInput from '../NativeSelect/NativeSelectInput'
import { useFormControl } from '../FormControl'
import formControlState from '../FormControl/formControlState'
import OutlinedInput from '../OutlinedInput'
import FilledInput from '../FilledInput'
import { useForkRef } from '../../hooks/useForkRef'
import { cx, styled } from '@linaria/atomic'

export type SelectVariants = 'outlined' | 'standard' | 'filled'
export type SelectProps<Value = unknown> = {
	/**
	 * If `true`, the width of the popover will automatically be set according to the items inside the
	 * menu, otherwise it will be at least the width of the select input.
	 * @default false
	 */
	autoWidth?: boolean
	children?: ReactNode
	/**
	 * If `true`, the component is initially open. Use when the component open state is not controlled (i.e. the `open` prop is not defined).
	 * You can only use it when the `native` prop is `false` (default).
	 * @default false
	 */
	defaultOpen?: boolean
	/**
	 * The default value. Use when the component is not controlled.
	 */
	defaultValue?: Value
	/**
	 * If `true`, a value is displayed even if no items are selected.
	 *
	 * In order to display a meaningful value, a function can be passed to the `renderValue` prop which
	 * returns the value to be displayed when no items are selected.
	 * @default false
	 */
	displayEmpty?: boolean
	/**
	 * The icon that displays the arrow.
	 * @default ArrowDropDown
	 */
	IconComponent?: ElementType
	id?: string
	input?: ReactElement<any, any>
	inputProps?: InputProps['inputProps']
	label?: ReactNode
	labelId?: string
	MenuProps?: Partial<MenuProps>
	/**
	 * If `true`, `value` must be an array and the menu will support multiple selections.
	 * @default false
	 */
	multiple?: boolean
	/**
	 * If `true`, the component uses a native `select` element.
	 * @default false
	 */
	native?: boolean
	onChange?: SelectInputProps<Value>['onChange']
	onClose?: (event: SyntheticEvent) => void
	onOpen?: (event: SyntheticEvent) => void
	open?: boolean
	renderValue?: (value: Value) => ReactNode
	SelectDisplayProps?: HTMLAttributes<HTMLDivElement>
	value?: Value | ''
	/**
	 * The variant to use.
	 * @default 'outlined'
	 */
	variant?: SelectVariants
} & Omit<InputProps, 'value' | 'onChange'>

const Select = forwardRef<Element, SelectProps>((p, ref) => {
	const {
		autoWidth = false,
		children,
		className,
		defaultOpen = false,
		displayEmpty = false,
		IconComponent = ArrowDropDown,
		id,
		input,
		inputProps,
		label,
		labelId,
		MenuProps,
		multiple = false,
		native = false,
		onClose,
		onOpen,
		open,
		renderValue,
		SelectDisplayProps,
		variant: variantProp = 'outlined',
		...other
	} = p

	const inputComponent = native ? NativeSelectInput : SelectInput

	const formControl = useFormControl()
	const fcs = formControlState({
		props: p,
		formControl,
		states: ['variant', 'error']
	})

	const variant = fcs.variant || variantProp

	const InputComponent =
		input ||
		{
			standard: <Input />,
			outlined: <OutlinedInput label={label} />,
			filled: <FilledInput />
		}[variant]

	const inputComponentRef = useForkRef(ref, InputComponent.ref)

	console.log('InputComponent', InputComponent, native, inputComponent)

	return (
		<>
			{cloneElement(InputComponent, {
				// Most of the logic is implemented in `SelectInput`.
				// The `Select` component is a simple API wrapper to expose something better to play with.
				inputComponent,
				inputProps: {
					children,
					error: fcs.error,
					IconComponent,
					variant,
					type: undefined, // We render a select. We can ignore the type provided by the `Input`.
					multiple,
					...(native
						? { id }
						: {
								autoWidth,
								defaultOpen,
								displayEmpty,
								labelId,
								MenuProps,
								onClose,
								onOpen,
								open,
								renderValue,
								SelectDisplayProps: { id, ...SelectDisplayProps }
							}),
					...inputProps,
					...(input ? input.props.inputProps : {})
				},
				...(((multiple && native) || displayEmpty) && variant === 'outlined'
					? { notched: true }
					: {}),
				ref: inputComponentRef,
				className: cx(InputComponent.props.className, className),
				// If a custom input is provided via 'input' prop, do not allow 'variant' to be propagated to it's root element. See https://github.com/mui/material-ui/issues/33894.
				...(!input && { variant }),
				...other
			})}
		</>
	)
})

export default Select
