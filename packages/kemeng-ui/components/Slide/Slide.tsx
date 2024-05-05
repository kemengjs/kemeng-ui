// Translate the node so it can't be seen on the screen.

import {
	ReactElement,
	cloneElement,
	forwardRef,
	useCallback,
	useEffect,
	useRef
} from 'react'
import ownerWindow from '../../utils/ownerDocument'
import { useTheme } from '../ThemePrivder'
import { getTransitionNum } from '../ThemePrivder/createTransition'
import { TransitionProps, getTransitionProps, reflow } from '../../utils'
import { Transition } from 'react-transition-group'
import { useForkRef } from '../../hooks/useForkRef'
import { debounce } from '../../utils/debounce'

// Later, we're going to translate the node back to its original location with `none`.
function getTranslateValue(
	direction: SlideProps['direction'],
	node: HTMLElement,
	resolvedContainer: Element
) {
	const rect = node.getBoundingClientRect()
	const containerRect =
		resolvedContainer && resolvedContainer.getBoundingClientRect()
	const containerWindow = ownerWindow(node)
	let transform

	// @ts-ignore
	if (node.fakeTransform) {
		// @ts-ignore
		transform = node.fakeTransform
	} else {
		const computedStyle = containerWindow.getComputedStyle(node)
		transform =
			computedStyle.getPropertyValue('-webkit-transform') ||
			computedStyle.getPropertyValue('transform')
	}

	let offsetX = 0
	let offsetY = 0

	if (transform && transform !== 'none' && typeof transform === 'string') {
		const transformValues = transform.split('(')[1].split(')')[0].split(',')
		offsetX = parseInt(transformValues[4], 10)
		offsetY = parseInt(transformValues[5], 10)
	}

	if (direction === 'left') {
		if (containerRect) {
			return `translateX(${containerRect.right + offsetX - rect.left}px)`
		}

		return `translateX(${containerWindow.innerWidth + offsetX - rect.left}px)`
	}

	if (direction === 'right') {
		if (containerRect) {
			return `translateX(-${rect.right - containerRect.left - offsetX}px)`
		}

		return `translateX(-${rect.left + rect.width - offsetX}px)`
	}

	if (direction === 'up') {
		if (containerRect) {
			return `translateY(${containerRect.bottom + offsetY - rect.top}px)`
		}
		return `translateY(${containerWindow.innerHeight + offsetY - rect.top}px)`
	}

	// direction === 'down'
	if (containerRect) {
		return `translateY(-${rect.top - containerRect.top + rect.height - offsetY}px)`
	}
	return `translateY(-${rect.top + rect.height - offsetY}px)`
}

function resolveContainer(containerPropProp: SlideProps['container']) {
	return typeof containerPropProp === 'function'
		? containerPropProp()
		: containerPropProp
}

export function setTranslateValue(
	direction: SlideProps['direction'],
	node: HTMLElement,
	containerProp: SlideProps['container']
) {
	const resolvedContainer = resolveContainer(containerProp)
	const transform = getTranslateValue(direction, node, resolvedContainer)

	if (transform) {
		node.style.webkitTransform = transform
		node.style.transform = transform
	}
}

export type SlideProps = {
	/**
	 * Perform the enter transition when it first mounts if `in` is also `true`.
	 * Set this to `false` to disable this behavior.
	 * @default true
	 */
	appear?: boolean
	/**
	 * A single child content element.
	 */
	children: ReactElement<any, any>
	/**
	 * An HTML element, or a function that returns one.
	 * It's used to set the container the Slide is transitioning from.
	 */
	container?: null | Element | ((element?: Element) => Element)
	/**
	 * Direction the child node will enter from.
	 * @default 'down'
	 */
	direction?: 'left' | 'right' | 'up' | 'down'
	/**
	 * The transition timing function.
	 * You may specify a single easing or a object containing enter and exit values.
	 * @default {
	 *   enter: theme.transitions.easing.easeOut,
	 *   exit: theme.transitions.easing.sharp,
	 * }
	 */
	easing?: TransitionProps['easing']
	/**
	 * If `true`, the component will transition in.
	 */
	in?: TransitionProps['in']
	/**
	 * The duration for the transition, in milliseconds.
	 * You may specify a single timeout for all transitions, or individually with an object.
	 * @default {
	 *   enter: theme.transitions.duration.enteringScreen,
	 *   exit: theme.transitions.duration.leavingScreen,
	 * }
	 */
	timeout?: TransitionProps['timeout']
	TransitionComponent?: typeof Transition
} & Omit<TransitionProps, 'timeout' | 'easing' | 'in'>

const Slide = forwardRef<Element, SlideProps>((p, ref) => {
	const { theme, createTransition } = useTheme()
	const defaultEasing = {
		enter: theme.transition.easeOut,
		exit: theme.transition.sharp
	}

	const defaultTimeout = {
		enter: getTransitionNum(theme.transition.enteringScreen),
		exit: getTransitionNum(theme.transition.leavingScreen)
	}

	const {
		addEndListener,
		appear = true,
		children,
		container: containerProp,
		direction = 'down',
		easing: easingProp = defaultEasing,
		in: inProp,
		onEnter,
		onEntered,
		onEntering,
		onExit,
		onExited,
		onExiting,
		style,
		timeout = defaultTimeout,
		TransitionComponent = Transition,
		...other
	} = p

	const childrenRef = useRef(null)
	// @ts-ignore
	const handleRef = useForkRef(children.ref, childrenRef, ref)

	const normalizedTransitionCallback =
		(callback: (node: HTMLElement, isAppearing?: boolean) => void) =>
		(isAppearing?: boolean) => {
			if (callback) {
				// onEnterXxx and onExitXxx callbacks have a different arguments.length value.
				if (isAppearing === undefined) {
					callback(childrenRef.current)
				} else {
					callback(childrenRef.current, isAppearing)
				}
			}
		}

	const handleEnter = normalizedTransitionCallback((node, isAppearing) => {
		setTranslateValue(direction, node, containerProp)
		reflow(node)

		if (onEnter) {
			onEnter(node, isAppearing)
		}
	})

	const handleEntering = normalizedTransitionCallback((node, isAppearing) => {
		const transitionProps = getTransitionProps(
			{ timeout, style, easing: easingProp },
			{
				mode: 'enter'
			}
		)

		node.style.webkitTransition = createTransition('-webkit-transform', {
			...transitionProps
		})

		node.style.transition = createTransition('transform', {
			...transitionProps
		})

		node.style.webkitTransform = 'none'
		node.style.transform = 'none'
		if (onEntering) {
			onEntering(node, isAppearing)
		}
	})

	const handleEntered = normalizedTransitionCallback(onEntered)
	const handleExiting = normalizedTransitionCallback(onExiting)

	const handleExit = normalizedTransitionCallback(node => {
		const transitionProps = getTransitionProps(
			{ timeout, style, easing: easingProp },
			{
				mode: 'exit'
			}
		)

		node.style.webkitTransition = createTransition(
			'-webkit-transform',
			transitionProps
		)
		node.style.transition = createTransition('transform', transitionProps)

		setTranslateValue(direction, node, containerProp)

		if (onExit) {
			onExit(node)
		}
	})

	const handleExited = normalizedTransitionCallback(node => {
		// No need for transitions when the component is hidden
		node.style.webkitTransition = ''
		node.style.transition = ''

		if (onExited) {
			onExited(node)
		}
	})

	const handleAddEndListener = next => {
		if (addEndListener) {
			// Old call signature before `react-transition-group` implemented `nodeRef`
			addEndListener(childrenRef.current, next)
		}
	}

	const updatePosition = useCallback(() => {
		if (childrenRef.current) {
			setTranslateValue(direction, childrenRef.current, containerProp)
		}
	}, [direction, containerProp])

	useEffect(() => {
		// Skip configuration where the position is screen size invariant.
		if (inProp || direction === 'down' || direction === 'right') {
			return undefined
		}

		const handleResize = debounce(() => {
			if (childrenRef.current) {
				setTranslateValue(direction, childrenRef.current, containerProp)
			}
		})

		const containerWindow = ownerWindow(childrenRef.current)
		containerWindow.addEventListener('resize', handleResize)
		return () => {
			handleResize.clear()
			containerWindow.removeEventListener('resize', handleResize)
		}
	}, [direction, inProp, containerProp])

	useEffect(() => {
		if (!inProp) {
			// We need to update the position of the drawer when the direction change and
			// when it's hidden.
			updatePosition()
		}
	}, [inProp, updatePosition])

	return (
		<TransitionComponent
			nodeRef={childrenRef}
			onEnter={handleEnter}
			onEntered={handleEntered}
			onEntering={handleEntering}
			onExit={handleExit}
			onExited={handleExited}
			onExiting={handleExiting}
			addEndListener={handleAddEndListener}
			appear={appear}
			in={inProp}
			timeout={timeout}
			{...other}
		>
			{(state, childProps) => {
				return cloneElement(children, {
					ref: handleRef,
					style: {
						visibility: state === 'exited' && !inProp ? 'hidden' : undefined,
						...style,
						...children.props.style
					},
					...childProps
				})
			}}
		</TransitionComponent>
	)
})

export default Slide
