import { forwardRef } from 'react'

import InputBase, {
	InputBaseRoot,
	InputBaseComponent as InputBaseInput,
	InputBaseProps,
	InputBaseK
} from '../InputBase/InputBase'
import { cx, styled } from '@linaria/atomic'
import { getK, unit } from '../../utils/style'
import { themeVariables } from '../../utils'
import { withNativeElementProps } from '../../utils/nativeProps'
import { useTheme } from '../ThemePrivder'
import { getTransitionNum } from '../ThemePrivder/createTransition'

const k = getK('Input')

const InputRoot = styled(InputBaseRoot)`
	position: relative;

	label + & {
		margin-top: ${({ formControl }) => {
			return formControl ? unit(2) : 0
		}};
	}

	&.${k('disableUnderline')} {
		&::after {
			border-bottom: ${({ color }) =>
				`2px solid ${themeVariables[color].main}`};

			left: 0;
			bottom: 0;
			content: '';
			position: absolute;
			right: 0;
			transform: scaleX(0);
			transition: ${({ transitionCss }) => transitionCss.transform};
			pointer-events: none;
		}

		&.${InputBaseK('focused')} {
			&::after {
				transform: scaleX(1) translateX(0);
			}
		}
		&.${InputBaseK('error')} {
			&::before,
			&::after {
				border-bottom-color: ${themeVariables.error.main};
			}
		}

		&::before {
			border-bottom: ${({ light }) =>
				`1px solid ${light ? 'rgba(0, 0, 0, 0.42)' : 'rgba(255, 255, 255, 0.7)'}`};

			left: 0;
			bottom: 0;
			content: '\\00a0';
			right: 0;
			transition: ${({ transitionCss }) =>
				transitionCss['border-bottom-color']};
			pointer-events: none;
		}

		&:hover {
			&:not(.${InputBaseK('disabled')}, .${InputBaseK('error')}) {
				&::before {
					border-bottom: 2px solid ${themeVariables.text.primary};

					@media (hover: none) {
						border-bottom: ${({ light }) =>
							`1px solid ${light ? 'rgba(0, 0, 0, 0.42)' : 'rgba(255, 255, 255, 0.7)'}`};
					}
				}
			}
		}
		&.${InputBaseK('disabled')} {
			&::before {
				border-bottom-style: dotted;
			}
		}
	}
`

const InputInput = styled(InputBaseInput)`
	box-sizing: content-box;
`

export type InputProps = {
	disableUnderline?: boolean
} & InputBaseProps

const Input = forwardRef<HTMLDivElement, InputProps>((p, ref) => {
	const {
		disableUnderline,
		fullWidth = false,
		inputComponent = 'input',
		multiline = false,
		type = 'text'
	} = p

	const { theme, createTransition } = useTheme()

	const transitionCss = {
		transform: createTransition('transform', {
			duration: getTransitionNum(theme.transition.shorter),
			easing: theme.transition.easeOut
		}),

		'border-bottom-color': createTransition('border-bottom-color', {
			duration: getTransitionNum(theme.transition.shorter)
		})
	}

	return withNativeElementProps(
		p,
		<InputBase
			className={cx(disableUnderline && k('disableUnderline'))}
			InputComponent={InputInput}
			transitionCss={transitionCss}
			RootComponent={InputRoot}
			inputComponent={inputComponent}
			multiline={multiline}
			fullWidth={fullWidth}
			ref={ref}
			type={type}
		/>
	)
})

export default Input
