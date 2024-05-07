import { cx, styled } from '@linaria/atomic'
import { BaseColorType, themeVariables } from '../../utils'
import { getK } from '../../utils/style'
import { forwardRef } from 'react'
import { NativeJSXElementsWithoutRef } from '../../utils/nativeProps'
import { useFormControl } from '../FormControl'
import formControlState from '../FormControl/formControlState'

const k = getK('FormLabel')

export const FormLabelRoot = styled.label`
	color: ${themeVariables.text.secondary};
	font-weight: ${themeVariables.typographyBody1.fontWeight};
	font-size: ${themeVariables.typographyBody1.fontSize};
	line-height: ${themeVariables.typographyBody1.lineHeight};
	letter-spacing: ${themeVariables.typographyBody1.letterSpacing};
	line-height: 1.4375em;
	padding: 0;
	position: relative;

	&.${k('focused')} {
		color: ${({ color }) => themeVariables[color].main};
	}
	&.${k('disabled')} {
		color: ${themeVariables.text.disabled};
	}
	&.${k('error')} {
		color: ${themeVariables.error.main};
	}
`

const AsteriskComponent = styled.span`
	&.${k('error')} {
		color: ${themeVariables.error.main};
	}
`
export type FormLabelProps = {
	color?: BaseColorType
	disabled?: boolean
	error?: boolean
	filled?: boolean
	focused?: boolean
	required?: boolean
	asteriskClassName?: string
} & NativeJSXElementsWithoutRef<'label'>
const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>((p, ref) => {
	const {
		children,
		className,
		color,
		disabled,
		error,
		filled,
		focused,
		required,
		asteriskClassName,
		...other
	} = p

	const formControl = useFormControl()
	const fcs = formControlState({
		props: p,
		formControl,
		states: ['color', 'required', 'focused', 'disabled', 'error', 'filled']
	})

	return (
		<FormLabelRoot
			className={cx(
				fcs.focused && k('focused'),
				fcs.disabled && k('disabled'),
				fcs.error && k('error'),
				className
			)}
			color={fcs.color}
			ref={ref}
			{...other}
		>
			{children}
			{fcs.required && (
				<AsteriskComponent
					aria-hidden
					className={cx(fcs.error && k('error'), asteriskClassName)}
				>
					&thinsp;{'*'}
				</AsteriskComponent>
			)}
		</FormLabelRoot>
	)
})

export default FormLabel
