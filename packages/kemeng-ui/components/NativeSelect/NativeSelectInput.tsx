import { cx, styled } from '@linaria/atomic'
import { getK } from '../../utils/style'
import { themeVariables } from '../../utils'
import { CSSProperties, ElementType, forwardRef } from 'react'
import {
	NativeJSXElementsWithoutRef,
	withComponentToAs
} from '../../utils/nativeProps'
import { useTheme } from '../ThemePrivder'

const k = getK('NativeSelectInput')

type NativeSelectSelectProps = {
	light: boolean
}

export const getNativeSelectSelectStyles = (
	curK: (styleName: string) => string
) => {
	const styles: CSSProperties & Record<string, CSSProperties | any> = {
		MozAppearance: 'none',
		WebkitAppearance: 'none',
		userSelect: 'none',
		borderRadius: 0,
		cursor: 'pointer',
		'&:focus': {
			borderRadius: 0
		},
		'&::-ms-expand': {
			display: 'none'
		},

		[`&.${curK('disabled')}`]: {
			cursor: 'default'
		},
		'&[multiple]': {
			height: 'auto'
		},

		'&:not([multiple]) option, &:not([multiple]) optgroup': {
			backgroundColor: themeVariables.background.paper
		},

		paddingRight: '24px',
		minWidth: '16px',

		[`&.${curK('filled')}`]: {
			paddingRight: '32px'
		},

		[`&.${curK('outlined')}`]: {
			borderRadius: themeVariables.shape.borderRadius,
			'&:focus': {
				borderRadius: themeVariables.shape.borderRadius
			},
			paddingRight: '32px'
		}
	}

	return styles
}

const NativeSelectSelectStyles = getNativeSelectSelectStyles(k)

const NativeSelectSelect = styled.select<NativeSelectSelectProps>`
	&:focus {
		background-color: ${({ light }) =>
			light ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)'};
	}
	${NativeSelectSelectStyles}
`

export const getNativeSelectIconStyles = (
	curK: (styleName: string) => string
) => {
	const styles: CSSProperties & Record<string, CSSProperties | any> = {
		position: 'absolute',
		right: 0,
		top: 'calc(50% - 0.5em)',
		pointerEvents: 'none',
		color: themeVariables.action.active,

		[`&.${curK('disabled')}`]: {
			color: themeVariables.action.disabled
		},

		[`&.${curK('open')}`]: {
			transform: 'rotate(180deg)'
		},

		[`&.${curK('filled')}`]: {
			right: '7px'
		},

		[`&.${curK('outlined')}`]: {
			right: '7px'
		}
	}

	return styles
}

const nativeSelectIconStyles = getNativeSelectIconStyles(k)

const NativeSelectIcon = styled.svg`
	${nativeSelectIconStyles}
`

export type NativeSelectInputProps = {
	disabled?: boolean
	IconComponent: ElementType
	IconComponentClassName?: string
	variant?: 'standard' | 'outlined' | 'filled'
	error?: boolean
} & NativeJSXElementsWithoutRef<'select'>

const NativeSelectInput = forwardRef<HTMLSelectElement, NativeSelectInputProps>(
	(p, ref) => {
		const {
			className,
			disabled,
			error,
			IconComponent,
			variant = 'standard',
			multiple,
			IconComponentClassName,
			...other
		} = p

		const { theme } = useTheme()

		return (
			<>
				<NativeSelectSelect
					className={cx(
						disabled && k('disabled'),
						variant === 'filled' && k('filled'),
						variant === 'outlined' && k('outlined'),
						className
					)}
					light={theme.mode === 'light'}
					disabled={disabled}
					ref={ref}
					{...other}
				/>
				{multiple
					? null
					: withComponentToAs(
							<IconComponent />,
							<NativeSelectIcon
								className={cx(
									disabled && k('disabled'),
									variant === 'filled' && k('filled'),
									variant === 'outlined' && k('outlined'),
									IconComponentClassName
								)}
							/>
						)}
			</>
		)
	}
)

export default NativeSelectInput
