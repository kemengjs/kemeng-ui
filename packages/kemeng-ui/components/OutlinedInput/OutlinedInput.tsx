import { css, cx, styled } from '@linaria/atomic'
import InputBase, {
	InputBaseComponentCss,
	InputBaseK,
	InputBaseProps,
	InputBaseRoot
} from '../InputBase'
import { themeVariables } from '../../utils'
import { getK } from '../../utils/style'
import NotchedOutline from './NotchedOutline'
import { forwardRef } from 'react'
import { useFormControl } from '../FormControl'
import formControlState from '../FormControl/formControlState'

const k = getK('OutlinedInput')

const OutlinedInputRoot = styled(InputBaseRoot)`
	position: relative;
	border-radius: ${themeVariables.shape.borderRadius};

	&:hover {
		.${k('notchedOutline')} {
			border-color: ${themeVariables.text.primary};
		}
	}

	@media (hover: none) {
		&:hover {
			.${k('notchedOutline')} {
				.theme-dark & {
					border-color: rgba(255, 255, 255, 0.23);
				}
				.theme-light & {
					border-color: rgba(0, 0, 0, 0.23);
				}
			}
		}
	}

	&.${InputBaseK('focused')} {
		.${k('notchedOutline')} {
			border-color: ${({ color }) => themeVariables[color].main};
			border-width: 2;
		}
	}
	&.${InputBaseK('error')} {
		.${k('notchedOutline')} {
			border-color: ${themeVariables.error.main};
		}
	}
	&.${InputBaseK('disabled')} {
		.${k('notchedOutline')} {
			border-color: ${themeVariables.action.disabled};
		}
	}
	&.${k('startAdornment')} {
		padding-left: 14px;
	}
	&.${k('endAdornment')} {
		padding-right: 14px;
	}

	&.${k('multiline')} {
		padding: 16.5px 14px;
		&.${InputBaseK('small')} {
			padding: 8.5px 14px;
		}
	}
`

const NotchedOutlineRoot = styled(NotchedOutline)`
	.theme-dark & {
		border-color: rgba(255, 255, 255, 0.23);
	}
	.theme-light & {
		border-color: rgba(0, 0, 0, 0.23);
	}
`

const OutlinedInputInputCss = css`
	padding: 16.5px 14px;
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
		padding: 8.5px 14px;
	}

	&.${k('multiline')} {
		padding: 0;
	}

	&.${k('startAdornment')} {
		padding-left: 0;
	}
	&.${k('endAdornment')} {
		padding-right: 0;
	}
`

export type OutlinedInputProps = {
	label?: React.ReactNode
	notched?: boolean
	notchedOutlineClassName?: string
} & InputBaseProps

const OutlinedInput = forwardRef<HTMLDivElement, OutlinedInputProps>(
	(p, ref) => {
		const {
			fullWidth = false,
			inputComponent = 'input',
			label,
			multiline = false,
			notched,
			type = 'text',
			notchedOutlineClassName,
			startAdornment,
			endAdornment,
			className,
			inputProps,
			...other
		} = p

		const formControl = useFormControl()
		const fcs = formControlState({
			props: p,
			formControl,
			states: [
				'color',
				'disabled',
				'error',
				'focused',
				'hiddenLabel',
				'size',
				'required'
			]
		})

		return (
			<InputBase
				RootComponent={OutlinedInputRoot}
				InputComponentCss={cx(InputBaseComponentCss, OutlinedInputInputCss)}
				inputProps={{
					...inputProps,
					className: cx(
						multiline && k('multiline'),
						startAdornment && k('startAdornment'),
						endAdornment && k('endAdornment'),
						inputProps.className
					)
				}}
				renderSuffix={state => (
					<NotchedOutlineRoot
						className={cx(k('notchedOutline'), notchedOutlineClassName)}
						label={
							label != null && label !== '' && fcs.required ? (
								<>
									{label}
									&thinsp;{'*'}
								</>
							) : (
								label
							)
						}
						notched={
							typeof notched !== 'undefined'
								? notched
								: Boolean(state.startAdornment || state.filled || state.focused)
						}
					/>
				)}
				startAdornment={startAdornment}
				endAdornment={endAdornment}
				className={cx(
					multiline && k('multiline'),
					startAdornment && k('startAdornment'),
					endAdornment && k('endAdornment'),
					className
				)}
				fullWidth={fullWidth}
				inputComponent={inputComponent}
				multiline={multiline}
				ref={ref}
				type={type}
				{...other}
			/>
		)
	}
)

export default OutlinedInput
