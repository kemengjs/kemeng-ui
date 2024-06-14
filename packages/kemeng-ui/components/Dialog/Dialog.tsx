import { cx, styled } from '@linaria/atomic'
import {
	JSXElementConstructor,
	ReactElement,
	ReactNode,
	forwardRef,
	useMemo,
	useRef
} from 'react'
import Modal, { ModalProps } from '../Modal'
import { getK } from '../../utils/style'
import Paper, { PaperProps } from '../Paper'
import { TransitionProps, themeVariables } from '../../utils'
import Fade from '../Fade'
import { useTheme } from '../ThemePrivder'
import { getTransitionNum } from '../ThemePrivder/createTransition'
import Backdrop from '../Backdrop'
import { useId } from '../../hooks/useId'
import DialogContext from './DialogContext'

const DialogBackdrop = styled(Backdrop)`
	z-index: -1;
`

const DialogRoot = styled(Modal)`
	@media print {
		position: absolute !important;
	}
`

const k = getK('Dialog')
const DialogContainer = styled.div`
	height: 100%;
	@media print {
		height: auto;
	}
	outline: 0;

	&.${k('paper')} {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&.${k('body')} {
		overflow-y: auto;
		overflow-x: hidden;
		text-align: center;
		&::after {
			content: '';
			display: inline-block;
			vertical-align: middle;
			height: 100%;
			width: 0;
		}
	}
`
const DialogPaper = styled(Paper)`
	margin: 32px;
	position: relative;
	@media print {
		overflow-y: visible;
		box-shadow: none;
	}

	&.${k('paper')} {
		display: flex;
		flex-direction: column;
		max-height: calc(100% - 64px);
	}

	&.${k('body')} {
		display: inline-block;
		vertical-align: middle;
	}

	&.${k('notMaxWidth')} {
		max-width: calc(100% - 64px);
	}

	&.${k('xs')} {
		max-width: ${themeVariables.breakpoints.xs};

		&.${k('body')} {
			@media (max-width: 508px) {
				max-width: calc(100% - 64px);
			}
		}
	}
	&.${k('sm')} {
		max-width: ${themeVariables.breakpoints.sm};

		&.${k('body')} {
			@media (max-width: 664px) {
				max-width: calc(100% - 64px);
			}
		}
	}
	&.${k('md')} {
		max-width: ${themeVariables.breakpoints.md};

		&.${k('body')} {
			@media (max-width: 964px) {
				max-width: calc(100% - 64px);
			}
		}
	}
	&.${k('lg')} {
		max-width: ${themeVariables.breakpoints.lg};

		&.${k('body')} {
			@media (max-width: 1264px) {
				max-width: calc(100% - 64px);
			}
		}
	}
	&.${k('xl')} {
		max-width: ${themeVariables.breakpoints.xl};

		&.${k('body')} {
			@media (max-width: 1600px) {
				max-width: calc(100% - 64px);
			}
		}
	}

	&.${k('fullWidth')} {
		width: calc(100% - 64px);
	}
	&.${k('fullScreen')} {
		margin: 0;
		width: 100%;
		max-width: 100%;
		height: 100%;
		max-height: none;
		border-radius: 0;
		&.${k('body')} {
			margin: 0;
			max-width: 100%;
		}
	}
`

export type DialogProps = {
	maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
	'aria-describedby'?: string
	'aria-labelledby'?: string
	disableEscapeKeyDown?: boolean
	fullScreen?: boolean
	fullWidth?: boolean
	PaperComponent?: JSXElementConstructor<PaperProps>
	PaperProps?: Partial<PaperProps>
	/**
	 * Determine the container for scrolling the dialog.
	 * @default 'paper'
	 */
	scroll?: 'body' | 'paper'
	TransitionComponent?: JSXElementConstructor<
		TransitionProps & { children: ReactElement<any, any> }
	>
	transitionDuration?: TransitionProps['timeout']
	TransitionProps?: TransitionProps
	containerClassName?: string
	children?: ReactNode
} & Omit<ModalProps, 'children'>

const Dialog = forwardRef<HTMLDivElement, DialogProps>((p, ref) => {
	const { theme } = useTheme()
	const defaultTransitionDuration = {
		enter: getTransitionNum(theme.transition.enteringScreen),
		exit: getTransitionNum(theme.transition.leavingScreen)
	}
	const {
		'aria-describedby': ariaDescribedby,
		'aria-labelledby': ariaLabelledbyProp,
		BackdropComponent: BackdropComponentProp,
		BackdropProps,
		children,
		className,
		disableEscapeKeyDown = false,
		fullScreen = false,
		fullWidth = false,
		maxWidth = 'sm',
		onBackdropClick,
		onClick,
		onClose,
		open,
		PaperComponent: PaperComponentProp,
		PaperProps = {},
		scroll = 'paper',
		TransitionComponent = Fade,
		transitionDuration = defaultTransitionDuration,
		TransitionProps,
		containerClassName,
		...other
	} = p

	const backdropClick = useRef(null)
	const handleMouseDown = event => {
		// We don't want to close the dialog when clicking the dialog content.
		// Make sure the event starts and ends on the same DOM element.
		backdropClick.current = event.target === event.currentTarget
	}
	const handleBackdropClick = event => {
		if (onClick) {
			onClick(event)
		}

		// Ignore the events not coming from the "backdrop".
		if (!backdropClick.current) {
			return
		}

		backdropClick.current = null

		if (onBackdropClick) {
			onBackdropClick(event)
		}

		if (onClose) {
			onClose(event, 'backdropClick')
		}
	}

	const ariaLabelledby = useId(ariaLabelledbyProp)
	const dialogContextValue = useMemo(() => {
		return { titleId: ariaLabelledby }
	}, [ariaLabelledby])

	const BackdropComponent = BackdropComponentProp || DialogBackdrop
	const PaperComponent = PaperComponentProp || DialogPaper

	return (
		<DialogRoot
			className={className}
			closeAfterTransition
			BackdropComponent={BackdropComponent}
			BackdropProps={{ transitionDuration }}
			onClose={onClose}
			disableEscapeKeyDown={disableEscapeKeyDown}
			open={open}
			ref={ref}
			onClick={handleBackdropClick}
			{...other}
		>
			<TransitionComponent
				appear
				in={open}
				timeout={transitionDuration}
				role='presentation'
				{...TransitionProps}
			>
				{/* roles are applied via cloneElement from TransitionComponent */}
				{/* roles needs to be applied on the immediate child of Modal or it'll inject one */}
				<DialogContainer
					className={cx(
						containerClassName,
						scroll === 'paper' ? k('paper') : k('body')
					)}
					onMouseDown={handleMouseDown}
				>
					<PaperComponent
						elevation={24}
						role='dialog'
						aria-describedby={ariaDescribedby}
						aria-labelledby={ariaLabelledby}
						{...PaperProps}
						className={cx(
							PaperProps.className,
							scroll === 'paper' ? k('paper') : k('body'),
							!maxWidth && k('notMaxWidth'),
							maxWidth === 'lg' && k('lg'),
							maxWidth === 'md' && k('md'),
							maxWidth === 'sm' && k('sm'),
							maxWidth === 'xl' && k('xl'),
							maxWidth === 'xs' && k('xs'),
							fullWidth && k('fullWidth'),
							fullScreen && k('fullScreen')
						)}
					>
						<DialogContext.Provider value={dialogContextValue}>
							{children}
						</DialogContext.Provider>
					</PaperComponent>
				</DialogContainer>
			</TransitionComponent>
		</DialogRoot>
	)
})

export default Dialog
