import { ReactElement, cloneElement, forwardRef, useRef } from 'react'
import { TransitionProps, getTransitionProps, reflow } from '../../utils'
import { Transition } from 'react-transition-group'
import { useTimeout } from '../../hooks/useTimeout'
import { useForkRef } from '../../hooks/useForkRef'
import { useTheme } from '../ThemePrivder'

function getScale(value) {
	return `scale(${value}, ${value ** 2})`
}

const styles = {
	entering: {
		opacity: 1,
		transform: getScale(1)
	},
	entered: {
		opacity: 1,
		transform: 'none'
	}
}

const isWebKit154 =
	typeof navigator !== 'undefined' &&
	/^((?!chrome|android).)*(safari|mobile)/i.test(navigator.userAgent) &&
	/(os |version\/)15(.|_)4/i.test(navigator.userAgent)

export type GrowProps = {
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
	easing?: TransitionProps['easing']
	/**
	 * If `true`, the component will transition in.
	 */
	in?: boolean
	/**
	 * The duration for the transition, in milliseconds.
	 * You may specify a single timeout for all transitions, or individually with an object.
	 *
	 * Set to 'auto' to automatically calculate transition time based on height.
	 * @default 'auto'
	 */
	timeout?: TransitionProps['timeout'] | 'auto'
	TransitionComponent?: typeof Transition
} & Omit<TransitionProps, 'timeout'>

const Grow = forwardRef<Element, GrowProps>((p, ref) => {
	const {
		addEndListener,
		appear = true,
		children,
		easing,
		in: inProp,
		onEnter,
		onEntered,
		onEntering,
		onExit,
		onExited,
		onExiting,
		style,
		timeout = 'auto',
		// eslint-disable-next-line react/prop-types
		TransitionComponent = Transition,
		...other
	} = p

	const timer = useTimeout()
	const autoTimeout = useRef<number>()
	const { getAutoHeightDuration, createTransition } = useTheme()

	const nodeRef = useRef(null)
	// @ts-ignore
	const handleRef = useForkRef(nodeRef, children.ref, ref)

	const normalizedTransitionCallback =
		(callback: (node: HTMLElement, isAppearing?: boolean) => void) =>
		(maybeIsAppearing?: boolean) => {
			if (callback) {
				const node = nodeRef.current

				// onEnterXxx and onExitXxx callbacks have a different arguments.length value.
				if (maybeIsAppearing === undefined) {
					callback(node)
				} else {
					callback(node, maybeIsAppearing)
				}
			}
		}
	const handleEntering = normalizedTransitionCallback(onEntering)

	const handleEnter = normalizedTransitionCallback((node, isAppearing) => {
		reflow(node) // So the animation always start from the start.

		const {
			duration: transitionDuration,
			delay,
			easing: transitionTimingFunction
		} = getTransitionProps(
			{ style, timeout, easing },
			{
				mode: 'enter'
			}
		)

		let duration: number
		if (timeout === 'auto') {
			duration = getAutoHeightDuration(node.clientHeight)
			autoTimeout.current = duration
		} else {
			duration = Number(transitionDuration)
		}

		node.style.transition = [
			createTransition('opacity', {
				duration,
				delay
			}),
			createTransition('transform', {
				duration: isWebKit154 ? duration : duration * 0.666,
				delay,
				easing: transitionTimingFunction
			})
		].join(',')

		if (onEnter) {
			onEnter(node, isAppearing)
		}
	})

	const handleEntered = normalizedTransitionCallback(onEntered)

	const handleExiting = normalizedTransitionCallback(onExiting)

	const handleExit = normalizedTransitionCallback(node => {
		const {
			duration: transitionDuration,
			delay,
			easing: transitionTimingFunction
		} = getTransitionProps(
			{ style, timeout, easing },
			{
				mode: 'exit'
			}
		)

		let duration: number
		if (timeout === 'auto') {
			duration = getAutoHeightDuration(node.clientHeight)
			autoTimeout.current = duration
		} else {
			duration = Number(transitionDuration)
		}

		node.style.transition = [
			createTransition('opacity', {
				duration,
				delay
			}),
			createTransition('transform', {
				duration: isWebKit154 ? duration : duration * 0.666,
				delay: isWebKit154 ? delay : delay || duration * 0.333,
				easing: transitionTimingFunction
			})
		].join(',')

		node.style.opacity = '0'
		node.style.transform = getScale(0.75)

		if (onExit) {
			onExit(node)
		}
	})

	const handleExited = normalizedTransitionCallback(onExited)

	const handleAddEndListener = next => {
		if (timeout === 'auto') {
			timer.start(autoTimeout.current || 0, next)
		}
		if (addEndListener) {
			// Old call signature before `react-transition-group` implemented `nodeRef`
			addEndListener(nodeRef.current, next)
		}
	}
	return (
		<TransitionComponent
			appear={appear}
			in={inProp}
			nodeRef={nodeRef}
			onEnter={handleEnter}
			onEntered={handleEntered}
			onEntering={handleEntering}
			onExit={handleExit}
			onExited={handleExited}
			onExiting={handleExiting}
			addEndListener={handleAddEndListener}
			timeout={timeout === 'auto' ? null : timeout}
			{...other}
		>
			{(state, childProps) => {
				return cloneElement(children, {
					style: {
						opacity: 0,
						transform: getScale(0.75),
						visibility: state === 'exited' && !inProp ? 'hidden' : undefined,
						...styles[state],
						...style,
						...children.props.style
					},
					ref: handleRef,
					...childProps
				})
			}}
		</TransitionComponent>
	)
})

export default Grow
