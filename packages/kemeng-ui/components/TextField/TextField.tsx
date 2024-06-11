import { styled } from '@linaria/atomic'
import { InputHTMLAttributes, ReactNode, Ref, forwardRef } from 'react'
import FormControl from '../FormControl'
import { getK } from '../../utils/style'
import { InputBaseProps } from '../InputBase'
import Input, { InputProps } from '../Input'
import FilledInput from '../FilledInput'
import OutlinedInput, { OutlinedInputProps } from '../OutlinedInput'
import { useId } from '../../hooks/useId'
import { FormControlProps } from '../FormControl/FormControl'
import FormHelperText, { FormHelperTextProps } from '../FormHelperText'
import InputLabel, { InputLabelProps } from '../InputLabel'
import { BaseColorType } from '../../utils'
import Select, { SelectProps } from '../Select'
import { NativeJSXElementsWithoutRef } from '../../utils/nativeProps'

const TextFieldRoot = styled(FormControl)`
	outline: 0;
`

const variantComponent = {
	standard: Input,
	filled: FilledInput,
	outlined: OutlinedInput
}

export type TextFieldProps = {
	autoFocus?: boolean
	id?: string
	variant?: 'outlined' | 'standard' | 'filled'
	children?: FormControlProps['children']
	FormHelperTextProps?: Partial<FormHelperTextProps>
	InputLabelProps?: Partial<InputLabelProps>
	autoComplete?: string
	helperText?: ReactNode
	color?: BaseColorType
	defaultValue?: unknown
	disabled?: boolean
	error?: boolean
	fullWidth?: boolean
	InputProps?: Partial<InputProps>
	inputRef?: Ref<any>
	label?: ReactNode
	multiline?: boolean
	name?: string
	onBlur?: InputBaseProps['onBlur']
	onFocus?: InputProps['onFocus']
	onChange?: InputProps['onChange']
	placeholder?: string
	required?: boolean
	rows?: string | number
	maxRows?: string | number
	minRows?: string | number
	select?: boolean
	SelectProps?: Partial<SelectProps>
	size?: 'small' | 'medium'
	value?: unknown
	type?: InputHTMLAttributes<unknown>['type']
	className?: string
} & NativeJSXElementsWithoutRef<'div'>
const TextField = forwardRef<HTMLDivElement, TextFieldProps>((p, ref) => {
	const {
		autoComplete,
		autoFocus = false,
		children,
		className,
		color = 'primary',
		defaultValue,
		disabled = false,
		error = false,
		FormHelperTextProps: FormHelperTextPropsProp,
		fullWidth = false,
		helperText,
		id: idOverride,
		InputLabelProps: InputLabelPropsProp,
		InputProps: InputPropsProp,
		inputRef,
		label,
		maxRows,
		minRows,
		multiline = false,
		name,
		onBlur,
		onChange,
		onFocus,
		placeholder,
		required = false,
		rows,
		select = false,
		SelectProps: SelectPropsProp,
		type,
		value,
		variant = 'outlined',
		...other
	} = p

	const id = useId(idOverride)
	const helperTextId = helperText && id ? `${id}-helper-text` : undefined
	const inputLabelId = label && id ? `${id}-label` : undefined
	const InputComponent = variantComponent[variant]

	const inputAdditionalProps: Partial<OutlinedInputProps> = {}
	if (variant === 'outlined') {
		if (
			InputLabelPropsProp &&
			typeof InputLabelPropsProp.shrink !== 'undefined'
		) {
			inputAdditionalProps.notched = InputLabelPropsProp.shrink
		}
		inputAdditionalProps.label = label
	}
	if (select) {
		// unset defaults from textbox inputs
		if (!SelectPropsProp || !SelectPropsProp.native) {
			inputAdditionalProps.id = undefined
		}
		inputAdditionalProps['aria-describedby'] = undefined
	}

	const InputElement = (
		<InputComponent
			aria-describedby={helperTextId}
			autoComplete={autoComplete}
			autoFocus={autoFocus}
			defaultValue={defaultValue}
			fullWidth={fullWidth}
			multiline={multiline}
			name={name}
			rows={rows}
			maxRows={maxRows}
			minRows={minRows}
			type={type}
			value={value}
			id={id}
			inputRef={inputRef}
			onBlur={onBlur}
			onChange={onChange}
			onFocus={onFocus}
			placeholder={placeholder}
			{...InputPropsProp}
			{...inputAdditionalProps}
		/>
	)

	return (
		<TextFieldRoot
			className={className}
			disabled={disabled}
			error={error}
			fullWidth={fullWidth}
			ref={ref}
			required={required}
			color={color}
			variant={variant}
			{...other}
		>
			{label != null && label !== '' && (
				<InputLabel htmlFor={id} id={inputLabelId} {...InputLabelPropsProp}>
					{label}
				</InputLabel>
			)}
			{select ? (
				<Select
					aria-describedby={helperTextId}
					id={id}
					labelId={inputLabelId}
					value={value}
					input={InputElement}
					{...SelectPropsProp}
				>
					{children}
				</Select>
			) : (
				InputElement
			)}

			{helperText && (
				<FormHelperText id={helperTextId} {...FormHelperTextPropsProp}>
					{helperText}
				</FormHelperText>
			)}
		</TextFieldRoot>
	)
})

export default TextField
