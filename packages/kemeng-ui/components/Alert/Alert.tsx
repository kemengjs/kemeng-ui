import { cx, styled } from '@linaria/atomic'
import { getK } from '../../utils/style'
import { ReactNode, forwardRef } from 'react'
import {
	NativeJSXElementsWithoutRef,
	withNativeElementProps
} from '../../utils/nativeProps'
import Paper from '../Paper'
import { themeVariables } from '../../utils'
import SuccessOutlinedIcon from '../../svg/SuccessOutlined'
import ReportProblemOutlinedIcon from '../../svg/ReportProblemOutlined'
import ErrorOutlineIcon from '../../svg/ErrorOutline'
import InfoOutlinedIcon from '../../svg/InfoOutlined'
import CloseIcon from '../../svg/Close'
import IconButton, { IconButtonProps } from '../IconButton'
import { SvgIconProps } from '../../svg/SvgIcon'

const k = getK('Alert')

const AlertIcon = styled.div`
	margin-right: 12px;
	padding: 7px 0;
	display: flex;
	font-size: 22px;
	opacity: 0.9;
`
const AlertRoot = styled(Paper)`
	font-weight: ${themeVariables.typographyBody2.fontWeight};
	font-size: ${themeVariables.typographyBody2.fontSize};
	line-height: ${themeVariables.typographyBody2.lineHeight};
	letter-spacing: ${themeVariables.typographyBody2.letterSpacing};
	background-color: transparent;
	display: flex;
	padding: 6px 16px;

	&.${k('standard')} {
		color: ${({ color }) => themeVariables[color].main};
		background-color: ${({ color }) =>
			`rgba(${themeVariables[color].mainRgb}, 0.2)`};
		& .${AlertIcon} {
			color: ${({ color }) => themeVariables[color].main};
		}
	}

	&.${k('outlined')} {
		color: ${({ color }) => themeVariables[color].main};
		border: ${({ color }) => themeVariables[color].light};
		& ${AlertIcon} {
			color: ${({ color }) => themeVariables[color].main};
		}
	}

	&.${k('filled')} {
		font-weight: 500;
		color: ${({ color }) => themeVariables[color].contrastText};
		background-color: ${({ color }) => themeVariables[color].main};
	}
`
const AlertMessage = styled.div`
	padding: 8px 0;
	min-width: 0;
	overflow: auto;
`

const AlertAction = styled.div`
	display: flex;
	align-items: flex-start;
	padding: 4px 0 0 16px;
	margin-left: auto;
	margin-right: -8px;
`

const defaultIconMapping = {
	success: <SuccessOutlinedIcon fontSize='inherit' />,
	warning: <ReportProblemOutlinedIcon fontSize='inherit' />,
	error: <ErrorOutlineIcon fontSize='inherit' />,
	info: <InfoOutlinedIcon fontSize='inherit' />
}

type AlertColor = 'success' | 'info' | 'warning' | 'error'
export type AlertProps = {
	/**
	 * The action to display. It renders after the message, at the end of the alert.
	 */
	action?: React.ReactNode
	/**
	 * Override the default label for the *close popup* icon button.
	 *
	 * For localization purposes, you can use the provided [translations](/material-ui/guides/localization/).
	 * @default 'Close'
	 */
	closeText?: string
	color?: AlertColor
	severity?: AlertColor
	components?: {
		CloseButton?: React.ElementType
		CloseIcon?: React.ElementType
	}
	componentsProps?: {
		closeButton?: IconButtonProps
		closeIcon?: SvgIconProps
	}
	icon?: ReactNode
	/**
	 * The ARIA role attribute of the element.
	 * @default 'alert'
	 */
	role?: string
	iconMapping?: Record<AlertColor, ReactNode>
	onClose?: (event: React.SyntheticEvent) => void
	variant?: 'standard' | 'filled' | 'outlined'
} & NativeJSXElementsWithoutRef<'div'>

const Alert = forwardRef<HTMLDivElement, AlertProps>((p, ref) => {
	const {
		action,
		children,
		closeText = 'Close',
		color,
		components = {},
		componentsProps = {
			closeButton: {},
			closeIcon: {}
		},
		icon,
		iconMapping = defaultIconMapping,
		onClose,
		role = 'alert',
		severity = 'success',
		variant = 'standard'
	} = p

	const CloseButtonComponent = components.CloseButton || IconButton
	const CloseIconComponent = components.CloseIcon || CloseIcon

	return withNativeElementProps(
		p,
		<AlertRoot
			role={role}
			color={severity || color}
			elevation={0}
			className={cx(
				variant === 'filled' && k('filled'),
				variant === 'standard' && k('standard'),
				variant === 'outlined' && k('outlined')
			)}
			ref={ref}
		>
			{icon !== false ? (
				<AlertIcon>
					{icon || iconMapping[severity] || defaultIconMapping[severity]}
				</AlertIcon>
			) : null}
			<AlertMessage>{children}</AlertMessage>
			{action != null ? <AlertAction>{action}</AlertAction> : null}
			{action == null && onClose ? (
				<AlertAction>
					<CloseButtonComponent
						size='small'
						aria-label={closeText}
						title={closeText}
						color='inherit'
						onClick={onClose}
						{...componentsProps.closeButton}
					>
						<CloseIconComponent
							fontSize='small'
							{...componentsProps.closeIcon}
						/>
					</CloseButtonComponent>
				</AlertAction>
			) : null}
		</AlertRoot>
	)
})

export default Alert
