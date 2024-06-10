import { css, cx, styled } from '@linaria/atomic'
import InputBase, {
	InputBaseComponentCss,
	InputBaseK,
	InputBaseProps,
	InputBaseRoot
} from '../InputBase'
import { themeVariables } from '../../utils'
import { getK } from '../../utils/style'
import { forwardRef } from 'react'

const k = getK('FilledInput')

const FilledInputRoot = styled(InputBaseRoot)`
	position: relative;
	.theme-dark & {
		background-color: rgba(255, 255, 255, 0.09);
	}
	.theme-light & {
		background-color: rgba(0, 0, 0, 0.06);
	}
	border-top-left-radius: ${themeVariables.shape.borderRadius};
	border-top-right-radius: ${themeVariables.shape.borderRadius};
	transition: background-color ${themeVariables.transition.short}
		${themeVariables.transition.easeInOut} 0ms;

	&:hover {
		.theme-dark & {
			background-color: rgba(255, 255, 255, 0.13);
		}
		.theme-light & {
			background-color: rgba(0, 0, 0, 0.09);
		}
	}
	@media (hover: none) {
		.theme-dark & {
			background-color: rgba(255, 255, 255, 0.09);
		}
		.theme-light & {
			background-color: rgba(0, 0, 0, 0.06);
		}
	}

	&.${InputBaseK('focused')} {
		.theme-dark & {
			background-color: rgba(255, 255, 255, 0.09);
		}
		.theme-light & {
			background-color: rgba(0, 0, 0, 0.06);
		}
	}

	&.${InputBaseK('disabled')} {
		.theme-dark & {
			background-color: rgba(255, 255, 255, 0.12);
		}
		.theme-light & {
			background-color: rgba(0, 0, 0, 0.12);
		}
	}

	&.${k('underline')} {
		&::after {
			border-bottom: ${({ color }) => themeVariables[color].main};
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
			.theme-dark & {
				border-bottom: 1px solid rgba(255, 255, 255, 0.7);
			}
			.theme-light & {
				border-bottom: 1px solid rgba(0, 0, 0, 0.42);
			}

			left: 0;
			bottom: 0;
			content: '\\00a0';
			position: absolute;
			right: 0;
			transition: border-bottom-color ${themeVariables.transition.shorter}
				${themeVariables.transition.easeInOut} 0ms;
			pointer-events: none;
		}

		&:hover {
			&:not(.${InputBaseK('disabled')}, .${InputBaseK('error')}) {
				&::before {
					border-bottom: 1px solid ${themeVariables.text.primary};
				}
			}
		}
		&.${InputBaseK('disabled')} {
			&::before {
				border-bottom-style: dotted;
			}
		}

		&.${k('startAdornment')} {
			padding-left: 12px;
		}
		&.${k('endAdornment')} {
			padding-right: 12px;
		}

		&.${k('multiline')} {
			padding: 25px 12px 8px;

			&.${InputBaseK('small')} {
				padding-top: 21px;
				padding-bottom: 4px;
			}

			&.${k('hiddenLabel')} {
				padding-top: 16px;
				padding-bottom: 17px;

				&.${InputBaseK('small')} {
					padding-top: 8px;
					padding-bottom: 9px;
				}
			}
		}
	}
`

const FilledInputInputCss = css`
	padding-top: 25px;
	padding-right: 12px;
	padding-bottom: 8px;
	padding-left: 12px;

	&:-webkit-autofill {
		.theme-dark & {
			-webkit-text-fill-color: #fff;
			-webkit-box-shadow: 0 0 0 100px #266798 inset;
			caret-color: #fff;
		}
		.theme-light & {
			-webkit-text-fill-color: none;
			-webkit-box-shadow: none;
			caret-color: none;
		}

		border-radius: inherit;
	}

	&.${InputBaseK('small')} {
		padding-top: 21px;
		padding-bottom: 4px;
	}

	&.${k('hiddenLabel')} {
		padding-top: 16px;
		padding-bottom: 17px;

		&.${InputBaseK('small')} {
			padding-top: 8px;
			padding-bottom: 9px;
		}
	}

	&.${k('startAdornment')} {
		padding-left: 0;
	}
	&.${k('endAdornment')} {
		padding-right: 0;
	}

	&.${k('multiline')} {
		padding-left: 0;
		padding-right: 0;
		padding-top: 0;
		padding-bottom: 0;
	}
`

export type FilledInputProps = {
	/**
	 * @default false
	 */
	hiddenLabel?: boolean
	disableUnderline?: boolean
} & InputBaseProps

const FilledInput = forwardRef<HTMLDivElement, FilledInputProps>((p, ref) => {
	const {
		disableUnderline,
		fullWidth = false,
		hiddenLabel, // declare here to prevent spreading to DOM
		inputComponent = 'input',
		multiline = false,
		type = 'text',
		startAdornment,
		endAdornment,
		inputProps,
		className,
		...other
	} = p

	return (
		<InputBase
			RootComponent={FilledInputRoot}
			InputComponentCss={cx(InputBaseComponentCss, FilledInputInputCss)}
			fullWidth={fullWidth}
			inputComponent={inputComponent}
			startAdornment={startAdornment}
			endAdornment={endAdornment}
			className={cx(
				!disableUnderline && k('underline'),
				multiline && k('multiline'),
				startAdornment && k('startAdornment'),
				endAdornment && k('endAdornment'),
				hiddenLabel && k('hiddenLabel'),
				className
			)}
			inputProps={{
				...inputProps,
				className: cx(
					multiline && k('multiline'),
					startAdornment && k('startAdornment'),
					endAdornment && k('endAdornment'),
					hiddenLabel && k('hiddenLabel'),
					inputProps.className
				)
			}}
			multiline={multiline}
			ref={ref}
			type={type}
			{...other}
		/>
	)
})

export default FilledInput
