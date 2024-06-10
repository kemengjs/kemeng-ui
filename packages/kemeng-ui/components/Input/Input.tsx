import { forwardRef } from 'react'

import InputBase, {
	InputBaseRoot,
	InputBaseProps,
	InputBaseK,
	InputBaseComponentCss
} from '../InputBase/InputBase'
import { css, cx, styled } from '@linaria/atomic'
import { getK, unit } from '../../utils/style'
import { themeVariables } from '../../utils'
import { withNativeElementProps } from '../../utils/nativeProps'

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
			transition: transform ${themeVariables.transition.shorter}
				${themeVariables.transition.easeOut} 0ms;
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
			.theme-light & {
				border-bottom: 1px solid rgba(0, 0, 0, 0.42);
			}
			.theme-dark & {
				border-bottom: 1px solid rgba(255, 255, 255, 0.7);
			}

			left: 0;
			bottom: 0;
			content: '\\00a0';
			right: 0;
			transition: border-bottom-color ${themeVariables.transition.shorter}
				${themeVariables.transition.easeInOut} 0ms;
			pointer-events: none;
		}

		&:hover {
			&:not(.${InputBaseK('disabled')}, .${InputBaseK('error')}) {
				&::before {
					border-bottom: 2px solid ${themeVariables.text.primary};

					@media (hover: none) {
						.theme-light & {
							border-bottom: 1px solid rgba(0, 0, 0, 0.42);
						}
						.theme-dark & {
							border-bottom: 1px solid rgba(255, 255, 255, 0.7);
						}
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

const InputInputCss = css`
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

	return withNativeElementProps(
		p,
		<InputBase
			className={cx(disableUnderline && k('disableUnderline'))}
			InputComponentCss={cx(InputBaseComponentCss, InputInputCss)}
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
