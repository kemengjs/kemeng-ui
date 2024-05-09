import { cx, styled } from '@linaria/atomic'
import InputBase, {
	InputBaseComponent,
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
import { useTheme } from '../ThemePrivder'

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
				border-color: ${({ light }) =>
					light ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)'};
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

type NotchedOutlineRootProps = {
	light: boolean
}
const NotchedOutlineRoot = styled(NotchedOutline)<NotchedOutlineRootProps>`
	border-color: ${({ light }) =>
		light ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)'};
`

const OutlinedInputInput = styled(InputBaseComponent)`
	padding: 16.5px 14px;
	&:-webkit-autofill {
		-webkit-text-fill-color: ${({ light }) => (light ? 'none' : '#fff')};
		-webkit-box-shadow: ${({ light }) =>
			light ? 'none' : '0 0 0 100px #266798 inset'};
		caret-color: ${({ light }) => (light ? 'none' : '#fff')};
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

		const { theme } = useTheme()

		console.log('outtt', OutlinedInputInput)

		return (
			<InputBase
				RootComponent={OutlinedInputRoot}
				InputComponent={OutlinedInputInput}
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
						light={theme.mode === 'light'}
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
					className,
					'testasdasdasdasdasd'
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
