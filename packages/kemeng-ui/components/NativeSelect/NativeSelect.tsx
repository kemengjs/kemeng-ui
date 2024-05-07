import { ElementType, ReactElement, cloneElement, forwardRef } from 'react'
import Input, { InputProps } from '../Input'
import NativeSelectInput, { NativeSelectInputProps } from './NativeSelectInput'
import formControlState from '../FormControl/formControlState'
import { useFormControl } from '../FormControl'
import { cx } from '@linaria/atomic'
import ArrowDropDown from '../../svg/ArrowDropDown'

const defaultInput = <Input />

export type NativeSelectProps = {
	/**
	 * The icon that displays the arrow.
	 * @default ArrowDropDownIcon
	 */
	IconComponent?: ElementType
	/**
	 * An `Input` element; does not have to be a material-ui specific `Input`.
	 * @default <Input />
	 */
	input?: ReactElement<any, any>
	onChange?: NativeSelectInputProps['onChange']
	value?: unknown
	variant?: 'standard' | 'outlined' | 'filled'
	inputProps?: Partial<NativeSelectInputProps>
	children?: React.ReactNode
} & Omit<InputProps, 'inputProps' | 'value' | 'onChange'>

const NativeSelect = forwardRef<Element, NativeSelectProps>((p, ref) => {
	const {
		className,
		children,
		IconComponent = ArrowDropDown,
		input = defaultInput,
		inputProps,
		variant,
		...other
	} = p

	const formControl = useFormControl()
	const fcs = formControlState({
		props: p,
		formControl,
		states: ['variant']
	})

	return (
		<>
			{cloneElement(input, {
				// Most of the logic is implemented in `NativeSelectInput`.
				// The `Select` component is a simple API wrapper to expose something better to play with.
				inputComponent: NativeSelectInput,
				inputProps: {
					children,
					IconComponent,
					variant: fcs.variant,
					type: undefined, // We render a select. We can ignore the type provided by the `Input`.
					...inputProps,
					...(input ? input.props.inputProps : {})
				},
				ref,
				...other,
				className: cx(className)
			})}
		</>
	)
})

export default NativeSelect
