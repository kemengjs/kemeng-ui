import { cx, styled } from '@linaria/atomic'
import FormLabel, { FormLabelProps } from '../FormLabel'
import { getK } from '../../utils/style'
import { forwardRef } from 'react'
import { useFormControl } from '../FormControl'
import formControlState from '../FormControl/formControlState'
import { useTheme } from '../ThemePrivder'
import { getTransitionNum } from '../ThemePrivder/createTransition'

const k = getK('InputLabel')

type InputLabelRootProps = {
	transitionCss?: Record<string, string>
}

const InputLabelRoot = styled(FormLabel)<InputLabelRootProps>`
	display: block;
	transform-origin: top left;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 100%;

	&.${k('formControl')} {
		position: absolute;
		left: 0;
		top: 0;
		transform: translate(0, 20px) scale(1);
	}

	&.${k('small')} {
		transform: translate(0, 17px) scale(1);
	}

	&.${k('shrink')} {
		transform: translate(0, -1.5px) scale(0.75);
		transform-origin: top left;
		max-width: 133%;
	}

	&.${k('animation')} {
		transition: ${({ transitionCss }) =>
			transitionCss['color-transform-max-width']};
	}

	&.${k('filled')} {
		z-index: 1;
		pointer-events: none;
		transform: translate(12px, 16px) scale(1);
		max-width: calc(100% - 24px);
		&.${k('small')} {
			transform: translate(12px, 13px) scale(1);
		}
		&.${k('shrink')} {
			user-select: none;
			pointer-events: auto;
			transform: translate(12px, 7px) scale(0.75);
			max-width: calc(133% - 24px);
			&.${k('small')} {
				transform: translate(12px, 4px) scale(0.75);
			}
		}
	}
	&.${k('outlined')} {
		z-index: 1;
		pointer-events: none;
		transform: translate(14px, 16px) scale(1);
		max-width: calc(100% - 24px);
		&.${k('small')} {
			transform: translate(14px, 9px) scale(1);
		}
		&.${k('shrink')} {
			user-select: none;
			pointer-events: auto;
			max-width: calc(133% - 32px);
			transform: translate(14px, -9px) scale(0.75);
		}
	}
`

export type InputLabelProps = {
	color?: FormLabelProps['color']
	/**
	 * If `true`, the transition animation is disabled.
	 * @default false
	 */
	disableAnimation?: boolean
	disabled?: boolean
	error?: boolean
	focused?: boolean
	margin?: 'dense'
	required?: boolean
	shrink?: boolean
	/**
	 * The size of the component.
	 * @default 'normal'
	 */
	size?: 'small' | 'normal'
	variant?: 'standard' | 'outlined' | 'filled'
}
const InputLabel = forwardRef<
	HTMLLabelElement,
	InputLabelProps & Omit<FormLabelProps, keyof InputLabelProps>
>((p, ref) => {
	const {
		disableAnimation = false,
		margin,
		shrink: shrinkProp,
		variant,
		className,
		...other
	} = p

	const { theme, createTransition } = useTheme()
	const transitionCss = {
		'color-transform-max-width': createTransition(
			['color', 'transform', 'max-width'],
			{
				duration: getTransitionNum(theme.transition.shorter),
				easing: theme.transition.easeOut
			}
		)
	}

	const formControl = useFormControl()

	let shrink = shrinkProp
	if (typeof shrink === 'undefined' && formControl) {
		shrink =
			formControl.filled || formControl.focused || formControl.adornedStart
	}

	const fcs = formControlState({
		props: p,
		formControl,
		states: ['size', 'variant', 'required', 'focused']
	})

	return (
		<InputLabelRoot
			data-shrink={shrink}
			ref={ref}
			transitionCss={transitionCss}
			className={cx(
				formControl && k('formControl'),
				fcs.size === 'small' && k('small'),
				!disableAnimation && k('animation'),
				fcs.variant === 'outlined' && k('outlined'),
				fcs.variant === 'filled' && k('filled'),
				shrink && k('shrink'),
				className
			)}
			{...other}
		/>
	)
})

export default InputLabel
