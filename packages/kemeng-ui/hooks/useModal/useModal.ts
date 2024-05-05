import {
	AriaAttributes,
	KeyboardEventHandler,
	MouseEvent,
	ReactElement,
	Ref,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react'
import { PortalProps } from '../../components/Portal'
import { ModalManager, ariaHidden } from './ModalManager'
import { useForkRef } from '../useForkRef'
import { useEventCallback } from '../useEventCallback'
import { ownerDocument } from '../../utils/ownerDocument'
import { EventHandlers, extractEventHandlers } from '../../utils/event'
import createChainedFunction from '../../utils/createChainedFunction'

export type UseModalParameters = {
	'aria-hidden'?: AriaAttributes['aria-hidden']
	/**
	 * A single child content element.
	 */
	children: ReactElement | undefined | null
	/**
	 * When set to true the Modal waits until a nested Transition is completed before closing.
	 * @default false
	 */
	closeAfterTransition?: boolean
	/**
	 * An HTML element or function that returns one.
	 * The `container` will have the portal children appended to it.
	 *
	 * You can also provide a callback, which is called in a React layout effect.
	 * This lets you set the container from a ref, and also makes server-side rendering possible.
	 *
	 * By default, it uses the body of the top-level document object,
	 * so it's simply `document.body` most of the time.
	 */
	container?: PortalProps['container']
	/**
	 * If `true`, hitting escape will not fire the `onClose` callback.
	 * @default false
	 */
	disableEscapeKeyDown?: boolean
	/**
	 * Disable the scroll lock behavior.
	 * @default false
	 */
	disableScrollLock?: boolean
	/**
	 * Callback fired when the component requests to be closed.
	 * The `reason` parameter can optionally be used to control the response to `onClose`.
	 *
	 * @param {object} event The event source of the callback.
	 * @param {string} reason Can be: `"escapeKeyDown"`, `"backdropClick"`.
	 */
	onClose?: {
		bivarianceHack(
			event: {},
			reason: 'backdropClick' | 'escapeKeyDown' | 'tabKeyDown'
		): void
	}['bivarianceHack']
	onKeyDown?: KeyboardEventHandler
	/**
	 * A function called when a transition enters.
	 */
	onTransitionEnter?: () => void
	/**
	 * A function called when a transition has exited.
	 */
	onTransitionExited?: () => void
	/**
	 * If `true`, the component is shown.
	 */
	open: boolean
	rootRef: Ref<Element>
}

export interface UseModalRootSlotOwnProps {
	role: React.AriaRole
	onKeyDown: React.KeyboardEventHandler
	ref: React.RefCallback<Element> | null
}

export interface UseModalBackdropSlotOwnProps {
	'aria-hidden': React.AriaAttributes['aria-hidden']
	onClick: React.MouseEventHandler
	open?: boolean
}

export type UseModalBackdropSlotProps<TOther = {}> = TOther &
	UseModalBackdropSlotOwnProps

export type UseModalRootSlotProps<TOther = {}> = TOther &
	UseModalRootSlotOwnProps

function getContainer(container: UseModalParameters['container']) {
	return typeof container === 'function' ? container() : container
}

function getHasTransition(children: UseModalParameters['children']) {
	return children ? children.props.hasOwnProperty('in') : false
}

const defaultManager = new ModalManager()

export function useModal(parameters: UseModalParameters) {
	const {
		container,
		disableEscapeKeyDown = false,
		disableScrollLock = false,
		closeAfterTransition = false,
		onTransitionEnter,
		onTransitionExited,
		children,
		onClose,
		open,
		rootRef
	} = parameters

	const manager = defaultManager

	const modal = useRef<{ modalRef: HTMLDivElement; mount: HTMLElement }>(
		{} as { modalRef: HTMLDivElement; mount: HTMLElement }
	)
	const mountNodeRef = useRef<HTMLElement | null>(null)
	const modalRef = useRef<HTMLDivElement>(null)
	const handleRef = useForkRef(modalRef, rootRef)
	const [exited, setExited] = useState(!open)
	const hasTransition = getHasTransition(children)

	let ariaHiddenProp = true
	if (
		parameters['aria-hidden'] === 'false' ||
		parameters['aria-hidden'] === false
	) {
		ariaHiddenProp = false
	}

	const getDoc = () => ownerDocument(mountNodeRef.current)
	const getModal = () => {
		modal.current.modalRef = modalRef.current!
		modal.current.mount = mountNodeRef.current!
		return modal.current
	}

	const handleMounted = () => {
		manager.mount(getModal(), { disableScrollLock })

		// Fix a bug on Chrome where the scroll isn't initially 0.
		if (modalRef.current) {
			modalRef.current.scrollTop = 0
		}
	}

	const handleOpen = useEventCallback(() => {
		const resolvedContainer = getContainer(container) || getDoc().body

		manager.add(getModal(), resolvedContainer as HTMLElement)

		// The element was already mounted.
		if (modalRef.current) {
			handleMounted()
		}
	})

	const isTopModal = useCallback(
		() => manager.isTopModal(getModal()),
		[manager]
	)

	const handlePortalRef = useEventCallback((node: HTMLElement) => {
		mountNodeRef.current = node

		if (!node) {
			return
		}

		if (open && isTopModal()) {
			handleMounted()
		} else if (modalRef.current) {
			ariaHidden(modalRef.current, ariaHiddenProp)
		}
	})

	const handleClose = useCallback(() => {
		manager.remove(getModal(), ariaHiddenProp)
	}, [ariaHiddenProp, manager])

	useEffect(() => {
		return () => {
			handleClose()
		}
	}, [handleClose])

	useEffect(() => {
		if (open) {
			handleOpen()
		} else if (!hasTransition || !closeAfterTransition) {
			handleClose()
		}
	}, [open, handleClose, hasTransition, closeAfterTransition, handleOpen])

	const createHandleKeyDown =
		(otherHandlers: EventHandlers) => (event: KeyboardEvent) => {
			otherHandlers.onKeyDown?.(event)

			// The handler doesn't take event.defaultPrevented into account:
			//
			// event.preventDefault() is meant to stop default behaviors like
			// clicking a checkbox to check it, hitting a button to submit a form,
			// and hitting left arrow to move the cursor in a text input etc.
			// Only special HTML elements have these default behaviors.
			if (
				event.key !== 'Escape' ||
				event.which === 229 || // Wait until IME is settled.
				!isTopModal()
			) {
				return
			}

			if (!disableEscapeKeyDown) {
				// Swallow the event, in case someone is listening for the escape key on the body.
				event.stopPropagation()

				if (onClose) {
					onClose(event, 'escapeKeyDown')
				}
			}
		}

	const createHandleBackdropClick =
		(otherHandlers: EventHandlers) => (event: MouseEvent) => {
			otherHandlers.onClick?.(event)

			if (event.target !== event.currentTarget) {
				return
			}

			if (onClose) {
				onClose(event, 'backdropClick')
			}
		}

	const getRootProps = <TOther extends EventHandlers = {}>(
		otherHandlers: TOther = {} as TOther
	) => {
		const propsEventHandlers = extractEventHandlers(
			parameters
		) as Partial<UseModalParameters>

		// The custom event handlers shouldn't be spread on the root element
		delete propsEventHandlers.onTransitionEnter
		delete propsEventHandlers.onTransitionExited

		const externalEventHandlers = {
			...propsEventHandlers,
			...otherHandlers
		}

		return {
			role: 'presentation',
			...externalEventHandlers,
			onKeyDown: createHandleKeyDown(externalEventHandlers),
			ref: handleRef
		}
	}

	const getBackdropProps = <TOther extends EventHandlers = {}>(
		otherHandlers: TOther = {} as TOther
	) => {
		const externalEventHandlers = otherHandlers

		return {
			'aria-hidden': true,
			...externalEventHandlers,
			onClick: createHandleBackdropClick(externalEventHandlers),
			open
		}
	}

	const getTransitionProps = () => {
		const handleEnter = () => {
			setExited(false)

			if (onTransitionEnter) {
				onTransitionEnter()
			}
		}

		const handleExited = () => {
			setExited(true)

			if (onTransitionExited) {
				onTransitionExited()
			}

			if (closeAfterTransition) {
				handleClose()
			}
		}

		return {
			onEnter: createChainedFunction(handleEnter, children?.props.onEnter),
			onExited: createChainedFunction(handleExited, children?.props.onExited)
		}
	}

	return {
		getRootProps,
		getBackdropProps,
		getTransitionProps,
		rootRef: handleRef,
		portalRef: handlePortalRef,
		isTopModal,
		exited,
		hasTransition
	}
}
