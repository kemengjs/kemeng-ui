import { cx, styled } from '@linaria/atomic'
import {
	ElementType,
	ReactElement,
	ReactEventHandler,
	cloneElement,
	forwardRef
} from 'react'
import { themeVariables } from '../../utils'
import { getK } from '../../utils/style'
import Backdrop, { BackdropProps } from '../Backdrop'
import { UseModalParameters, useModal } from '../../hooks/useModal'
import Portal, { PortalProps } from '../Portal'
import { NativeJSXElementsWithoutRef } from '../../utils/nativeProps'
import FocusTrap from '../FocusTrap'
import { EventHandlers } from '../../utils/event'

const k = getK('Modal')

const ModalRoot = styled.div`
	position: fixed;
	z-index: ${themeVariables.zIndex.modal};
	right: 0;
	bottom: 0;
	top: 0;
	left: 0;

	&.${k('hidden')} {
		visibility: hidden;
	}
`

const ModalBackdrop = styled(Backdrop)`
	z-index: -1;
`

export type ModalProps = {
	open: boolean
	disableAutoFocus?: boolean
	disableEnforceFocus?: boolean
	disableEscapeKeyDown?: boolean
	disablePortal?: boolean
	disableRestoreFocus?: boolean
	disableScrollLock?: boolean
	hideBackdrop?: boolean
	keepMounted?: boolean
	closeAfterTransition?: boolean
	children: ReactElement
	container?: PortalProps['container']
	BackdropComponent?: ElementType<BackdropProps>
	onBackdropClick?: ReactEventHandler<{}>
	onBackdropOther?: EventHandlers
	BackdropProps?: BackdropProps
	onClose?: UseModalParameters['onClose']
	onTransitionEnter?: UseModalParameters['onTransitionEnter']
	onTransitionExited?: UseModalParameters['onTransitionExited']
} & NativeJSXElementsWithoutRef<'div'>

const Modal = forwardRef<HTMLDivElement, ModalProps>((p, ref) => {
	const {
		disableAutoFocus = false,
		disableEnforceFocus = false,
		disableEscapeKeyDown = false,
		disablePortal = false,
		disableRestoreFocus = false,
		disableScrollLock = false,
		hideBackdrop = false,
		keepMounted = false,
		closeAfterTransition = false,
		onBackdropClick,
		onBackdropOther = {},
		BackdropProps = {},
		container,
		children,
		open,
		BackdropComponent = ModalBackdrop,
		className,
		onClose,
		onTransitionEnter,
		onTransitionExited,
		...other
	} = p

	const {
		getRootProps,
		getBackdropProps,
		getTransitionProps,
		portalRef,
		isTopModal,
		exited,
		hasTransition
	} = useModal({
		closeAfterTransition,
		disableEscapeKeyDown,
		disableScrollLock,
		rootRef: ref,
		open,
		children,
		onClose,
		onTransitionEnter,
		onTransitionExited
	})

	const childProps: ReactElement['props'] = {}
	if (children.props.tabIndex === undefined) {
		childProps.tabIndex = '-1'
	}

	// It's a Transition like component
	if (hasTransition) {
		const { onEnter, onExited } = getTransitionProps()
		childProps.onEnter = onEnter
		childProps.onExited = onExited
	}

	if (!keepMounted && !open && (!hasTransition || exited)) {
		return null
	}

	return (
		<Portal ref={portalRef} container={container} disablePortal={disablePortal}>
			<ModalRoot
				className={cx(!open && exited && k('hidden'), className)}
				{...getRootProps()}
				{...other}
			>
				{!hideBackdrop && BackdropComponent ? (
					<BackdropComponent
						{...getBackdropProps({
							...onBackdropOther,
							onClick: e => {
								if (onBackdropClick) {
									onBackdropClick(e)
								}
								if (onBackdropOther?.onClick) {
									onBackdropOther.onClick(e)
								}
							}
						})}
						{...BackdropProps}
					/>
				) : null}

				<FocusTrap
					disableEnforceFocus={disableEnforceFocus}
					disableAutoFocus={disableAutoFocus}
					disableRestoreFocus={disableRestoreFocus}
					isEnabled={isTopModal}
					open={open}
				>
					{cloneElement(children, childProps)}
				</FocusTrap>
			</ModalRoot>
		</Portal>
	)
})

export default Modal
