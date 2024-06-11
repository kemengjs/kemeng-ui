import { cx, styled } from '@linaria/atomic'
import { themeVariables } from '../../utils'
import { getK } from '../../utils/style'
import { ReactNode, forwardRef } from 'react'
import { useFormControl } from '../FormControl'
import formControlState from '../FormControl/formControlState'
import { NativeJSXElementsWithoutRef } from '../../utils/nativeProps'

const k = getK('FormHelperText')
const FormHelperTextRoot = styled.p`
	color: ${themeVariables.text.secondary};
	font-weight: ${themeVariables.typographyCaption.fontWeight};
	font-size: ${themeVariables.typographyCaption.fontSize};
	line-height: ${themeVariables.typographyCaption.lineHeight};
	letter-spacing: ${themeVariables.typographyCaption.letterSpacing};
	text-align: left;
	margin-top: 3px;
	margin-right: 0;
	margin-bottom: 0;
	margin-left: 0;
	.${k('disabled')} {
		color: ${themeVariables.text.disabled};
	}

	.${k('error')} {
		color: ${themeVariables.error.main};
	}
	.${k('small')} {
		margin-top: 4px;
	}

	.${k('contained')} {
		margin-left: 14px;
		margin-right: 14px;
	}
`
export type FormHelperTextProps = {
	children?: ReactNode
	disabled?: boolean
	error?: boolean
	filled?: boolean
	focused?: boolean
	required?: boolean
	margin?: 'dense'
	variant?: 'standard' | 'outlined' | 'filled'
} & NativeJSXElementsWithoutRef<'p'>
const FormHelperText = forwardRef<HTMLParagraphElement, FormHelperTextProps>(
	(p, ref) => {
		const {
			children,
			className,
			disabled,
			error,
			filled,
			focused,
			margin,
			required,
			variant,
			...other
		} = p

		const formControl = useFormControl()

		const fcs = formControlState({
			props: p,
			formControl,
			states: [
				'variant',
				'size',
				'disabled',
				'error',
				'filled',
				'focused',
				'required'
			]
		})

		return (
			<FormHelperTextRoot
				className={cx(
					fcs.disabled && k('disabled'),
					fcs.size === 'small' && k('small'),
					fcs.size === 'error' && k('error'),
					(fcs.variant === 'filled' || fcs.variant === 'outlined') &&
						k('contained'),
					className
				)}
				ref={ref}
				{...other}
			>
				{children === ' ' ? (
					// notranslate needed while Google Translate will not fix zero-width space issue
					<span className='notranslate'>&#8203;</span>
				) : (
					children
				)}
			</FormHelperTextRoot>
		)
	}
)

export default FormHelperText
