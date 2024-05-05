import {
	JSXElementConstructor,
	MutableRefObject,
	ReactNode,
	Ref,
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState
} from 'react'
import Modal, { ModalProps } from '../Modal'
import Paper, { PaperProps } from '../Paper'
import { TransitionProps } from '../../utils'
import {
	NativeJSXElementsWithoutRef,
	withNativeElementProps,
	withNativeProps
} from '../../utils/nativeProps'
import { styled } from '@linaria/atomic'
import { unit } from '../../utils/style'
import Grow from '../Grow'
import ownerWindow, { ownerDocument } from '../../utils/ownerDocument'
import { useForkRef } from '../../hooks/useForkRef'
import { debounce } from '../../utils/debounce'

export function getOffsetTop(
	rect: Partial<DOMRect>,
	vertical: PopoverOrigin['vertical']
) {
	let offset = 0

	if (typeof vertical === 'number') {
		offset = vertical
	} else if (vertical === 'center') {
		offset = rect.height / 2
	} else if (vertical === 'bottom') {
		offset = rect.height
	}

	return offset
}

export function getOffsetLeft(
	rect: Partial<DOMRect>,
	horizontal: PopoverOrigin['horizontal']
) {
	let offset = 0

	if (typeof horizontal === 'number') {
		offset = horizontal
	} else if (horizontal === 'center') {
		offset = rect.width / 2
	} else if (horizontal === 'right') {
		offset = rect.width
	}

	return offset
}

function getTransformOriginValue(transformOrigin) {
	return [transformOrigin.horizontal, transformOrigin.vertical]
		.map(n => (typeof n === 'number' ? `${n}px` : n))
		.join(' ')
}

function resolveAnchorEl(anchorEl: PopoverProps['anchorEl']) {
	return typeof anchorEl === 'function' ? anchorEl() : anchorEl
}

export interface PopoverActions {
	updatePosition(): void
}

export interface PopoverPosition {
	top: number
	left: number
}
interface PopoverVirtualElement {
	getBoundingClientRect: () => DOMRect
	nodeType: Node['ELEMENT_NODE']
}

export interface PopoverOrigin {
	vertical: 'top' | 'center' | 'bottom' | number
	horizontal: 'left' | 'center' | 'right' | number
}

export type PopoverReference = 'anchorEl' | 'anchorPosition' | 'none'

export type PopoverProps = {
	action?: Ref<PopoverActions>
	anchorEl?:
		| null
		| Element
		| (() => Element)
		| PopoverVirtualElement
		| (() => PopoverVirtualElement)
	anchorOrigin?: PopoverOrigin
	anchorPosition?: PopoverPosition
	anchorReference?: PopoverReference
	children?: ReactNode
	container?: ModalProps['container']
	/**
	 * The elevation of the popover.
	 * @default 8
	 */
	elevation?: PaperProps['elevation']
	/**
	 * Specifies how close to the edge of the window the popover can appear.
	 * If null, the popover will not be constrained by the window.
	 * @default 16
	 */
	marginThreshold?: number | null
	onClose?: ModalProps['onClose']
	open: boolean
	PaperProps?: Partial<PaperProps>
	PaperRef?: MutableRefObject<HTMLDivElement>
	/**
	 * This is the point on the popover which
	 * will attach to the anchor's origin.
	 *
	 * Options:
	 * vertical: [top, center, bottom, x(px)];
	 * horizontal: [left, center, right, x(px)].
	 * @default {
	 *   vertical: 'top',
	 *   horizontal: 'left',
	 * }
	 */
	transformOrigin?: PopoverOrigin
	transitionDuration?: TransitionProps['timeout'] | 'auto'
	TransitionProps?: TransitionProps
	TransitionComponent?: JSXElementConstructor<
		TransitionProps & { children: React.ReactElement<any, any> }
	>
	disableScrollLock?: boolean
} & NativeJSXElementsWithoutRef<'div'>

const PopoverRoot = styled(Modal)`
	outline: 0;
`

export const PopoverPaper = styled(Paper)`
	position: absolute;
	overflow-y: auto;
	overflow-x: hidden;
	min-width: ${unit(2)};
	min-height: ${unit(2)};
	max-width: calc(100% - ${unit(4)});
	max-height: calc(100% - ${unit(4)});
	outline: 0;
`

const Popover = forwardRef<
	HTMLDivElement,
	PopoverProps & Omit<ModalProps, keyof PopoverProps>
>((p, ref) => {
	const {
		action,
		anchorEl,
		anchorOrigin = {
			vertical: 'top',
			horizontal: 'left'
		},
		anchorPosition,
		anchorReference = 'anchorEl',
		children,
		container: containerProp,
		elevation = 8,
		marginThreshold = 16,
		open,
		PaperProps: PaperPropsProp = {},
		PaperRef: PaperRefProp,
		transformOrigin = {
			vertical: 'top',
			horizontal: 'left'
		},
		TransitionComponent = Grow,
		transitionDuration: transitionDurationProp = 'auto',
		TransitionProps: { onEntering, ...TransitionProps } = {},
		disableScrollLock = false
	} = p

	const paperRef = useRef<HTMLDivElement>(null)
	const handlePaperRef = useForkRef(paperRef, PaperRefProp)

	// Returns the top/left offset of the position
	// to attach to on the anchor element (or body if none is provided)
	const getAnchorOffset = useCallback(() => {
		if (anchorReference === 'anchorPosition') {
			if (process.env.NODE_ENV !== 'production') {
				if (!anchorPosition) {
					console.error(
						'You need to provide a `anchorPosition` prop when using ' +
							'<Popover anchorReference="anchorPosition" />.'
					)
				}
			}
			return anchorPosition
		}

		const resolvedAnchorEl = resolveAnchorEl(anchorEl)

		// If an anchor element wasn't provided, just use the parent body element of this Popover
		const anchorElement =
			resolvedAnchorEl && resolvedAnchorEl.nodeType === 1
				? resolvedAnchorEl
				: ownerDocument(paperRef.current).body
		const anchorRect = anchorElement.getBoundingClientRect()

		if (process.env.NODE_ENV !== 'production') {
			const box = anchorElement.getBoundingClientRect()

			if (
				process.env.NODE_ENV !== 'test' &&
				box.top === 0 &&
				box.left === 0 &&
				box.right === 0 &&
				box.bottom === 0
			) {
				console.warn(
					[
						'The `anchorEl` prop provided to the component is invalid.',
						'The anchor element should be part of the document layout.',
						"Make sure the element is present in the document or that it's not display none."
					].join('\n')
				)
			}
		}

		return {
			top: anchorRect.top + getOffsetTop(anchorRect, anchorOrigin.vertical),
			left: anchorRect.left + getOffsetLeft(anchorRect, anchorOrigin.horizontal)
		}
	}, [
		anchorEl,
		anchorOrigin.horizontal,
		anchorOrigin.vertical,
		anchorPosition,
		anchorReference
	])

	// Returns the base transform origin using the element
	const getTransformOrigin = useCallback(
		(elemRect: Partial<DOMRect>) => {
			return {
				vertical: getOffsetTop(elemRect, transformOrigin.vertical),
				horizontal: getOffsetLeft(elemRect, transformOrigin.horizontal)
			}
		},
		[transformOrigin.horizontal, transformOrigin.vertical]
	)

	const getPositioningStyle = useCallback(
		(element: HTMLElement) => {
			const elemRect: Partial<DOMRect> = {
				width: element.offsetWidth,
				height: element.offsetHeight
			}

			// Get the transform origin point on the element itself
			const elemTransformOrigin = getTransformOrigin(elemRect)

			if (anchorReference === 'none') {
				return {
					top: null,
					left: null,
					transformOrigin: getTransformOriginValue(elemTransformOrigin)
				}
			}

			// Get the offset of the anchoring element
			const anchorOffset = getAnchorOffset()

			// Calculate element positioning
			let top = anchorOffset.top - elemTransformOrigin.vertical
			let left = anchorOffset.left - elemTransformOrigin.horizontal
			const bottom = top + elemRect.height
			const right = left + elemRect.width

			// Use the parent window of the anchorEl if provided
			const containerWindow = ownerWindow(resolveAnchorEl(anchorEl) as Node)

			// Window thresholds taking required margin into account
			const heightThreshold = containerWindow.innerHeight - marginThreshold
			const widthThreshold = containerWindow.innerWidth - marginThreshold

			// Check if the vertical axis needs shifting
			if (marginThreshold !== null && top < marginThreshold) {
				const diff = top - marginThreshold

				top -= diff

				elemTransformOrigin.vertical += diff
			} else if (marginThreshold !== null && bottom > heightThreshold) {
				const diff = bottom - heightThreshold

				top -= diff

				elemTransformOrigin.vertical += diff
			}

			if (process.env.NODE_ENV !== 'production') {
				if (
					elemRect.height > heightThreshold &&
					elemRect.height &&
					heightThreshold
				) {
					console.error(
						[
							'The popover component is too tall.',
							`Some part of it can not be seen on the screen (${
								elemRect.height - heightThreshold
							}px).`,
							'Please consider adding a `max-height` to improve the user-experience.'
						].join('\n')
					)
				}
			}

			// Check if the horizontal axis needs shifting
			if (marginThreshold !== null && left < marginThreshold) {
				const diff = left - marginThreshold
				left -= diff
				elemTransformOrigin.horizontal += diff
			} else if (right > widthThreshold) {
				const diff = right - widthThreshold
				left -= diff
				elemTransformOrigin.horizontal += diff
			}

			return {
				top: `${Math.round(top)}px`,
				left: `${Math.round(left)}px`,
				transformOrigin: getTransformOriginValue(elemTransformOrigin)
			}
		},
		[
			anchorEl,
			anchorReference,
			getAnchorOffset,
			getTransformOrigin,
			marginThreshold
		]
	)

	const [isPositioned, setIsPositioned] = useState(open)

	const setPositioningStyles = useCallback(() => {
		const element = paperRef.current

		if (!element) {
			return
		}

		const positioning = getPositioningStyle(element)

		if (positioning.top !== null) {
			element.style.top = positioning.top
		}
		if (positioning.left !== null) {
			element.style.left = positioning.left
		}
		element.style.transformOrigin = positioning.transformOrigin
		setIsPositioned(true)
	}, [getPositioningStyle])

	useEffect(() => {
		if (disableScrollLock) {
			window.addEventListener('scroll', setPositioningStyles)
		}
		return () => window.removeEventListener('scroll', setPositioningStyles)
	}, [anchorEl, disableScrollLock, setPositioningStyles])

	const handleEntering = (element: HTMLElement, isAppearing: boolean) => {
		if (onEntering) {
			onEntering(element, isAppearing)
		}

		setPositioningStyles()
	}

	const handleExited = () => {
		setIsPositioned(false)
	}

	useEffect(() => {
		if (open) {
			setPositioningStyles()
		}
	})

	useImperativeHandle(
		action,
		() =>
			open
				? {
						updatePosition: () => {
							setPositioningStyles()
						}
					}
				: null,
		[open, setPositioningStyles]
	)

	useEffect(() => {
		if (!open) {
			return undefined
		}

		const handleResize = debounce(() => {
			setPositioningStyles()
		})

		const containerWindow = ownerWindow(anchorEl as Node)
		containerWindow.addEventListener('resize', handleResize)
		return () => {
			handleResize.clear()
			containerWindow.removeEventListener('resize', handleResize)
		}
	}, [anchorEl, open, setPositioningStyles])

	let transitionDuration = transitionDurationProp

	if (transitionDurationProp === 'auto') {
		transitionDuration = undefined
	}

	// If the container prop is provided, use that
	// If the anchorEl prop is provided, use its parent body element as the container
	// If neither are provided let the Modal take care of choosing the container
	const container =
		containerProp ||
		(anchorEl
			? ownerDocument(resolveAnchorEl(anchorEl) as Node).body
			: undefined)

	return withNativeElementProps(
		p,
		<PopoverRoot
			disableScrollLock={disableScrollLock}
			BackdropProps={{
				invisible: true
			}}
			open={open}
			container={container}
			ref={ref}
		>
			<TransitionComponent
				appear
				in={open}
				onEntering={handleEntering}
				onExited={handleExited}
				timeout={transitionDuration}
				{...TransitionProps}
			>
				{withNativeProps(
					PaperPropsProp,
					<PopoverPaper
						elevation={elevation}
						ref={handlePaperRef}
						style={isPositioned ? {} : { opacity: 0 }}
					>
						{children}
					</PopoverPaper>
				)}
			</TransitionComponent>
		</PopoverRoot>
	)
})

export default Popover
