import { ReactElement, cloneElement, forwardRef, useRef } from 'react'
import { Transition } from 'react-transition-group'
import { TransitionProps, getTransitionProps, reflow } from '../../utils'
import { useTheme } from '../ThemePrivder'
import { useForkRef } from '../../hooks/useForkRef'
import { getTransitionNum } from '../ThemePrivder/createTransition'

const styles = {
	entering: {
		opacity: 1
	},
	entered: {
		opacity: 1
	}
}

export type FadeProps = {
	appear?: boolean
	easing?: TransitionProps['easing']
	in?: boolean
	timeout?: TransitionProps['timeout']
	children: ReactElement<any, any>
	TransitionComponent?: typeof Transition
} & Omit<TransitionProps, 'children'>

const Fade = forwardRef<HTMLElement, FadeProps>((p, ref) => {
	const { theme, createTransition } = useTheme()

	const defaultTimeout = {
		enter: getTransitionNum(theme.transition.enteringScreen),
		exit: getTransitionNum(theme.transition.leavingScreen)
	}

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
		timeout = defaultTimeout,
		TransitionComponent = Transition,
		...other
	} = p

	const enableStrictModeCompat = true
	const nodeRef = useRef<HTMLElement>(null)

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

		const transitionProps = getTransitionProps(
			{ style, timeout, easing },
			{
				mode: 'enter'
			}
		)

		node.style.webkitTransition = createTransition('opacity', transitionProps)
		node.style.transition = createTransition('opacity', transitionProps)

		if (onEnter) {
			onEnter(node, isAppearing)
		}
	})

	const handleEntered = normalizedTransitionCallback(onEntered)

	const handleExiting = normalizedTransitionCallback(onExiting)

	const handleExit = normalizedTransitionCallback(node => {
		const transitionProps = getTransitionProps(
			{ style, timeout, easing },
			{
				mode: 'exit'
			}
		)

		node.style.webkitTransition = createTransition('opacity', transitionProps)
		node.style.transition = createTransition('opacity', transitionProps)

		if (onExit) {
			onExit(node)
		}
	})

	const handleExited = normalizedTransitionCallback(onExited)

	const handleAddEndListener = (next: () => void) => {
		if (addEndListener) {
			// Old call signature before `react-transition-group` implemented `nodeRef`
			addEndListener(nodeRef.current, next)
		}
	}

	return (
		<TransitionComponent
			appear={appear}
			in={inProp}
			nodeRef={enableStrictModeCompat ? nodeRef : undefined}
			onEnter={handleEnter}
			onEntered={handleEntered}
			onEntering={handleEntering}
			onExit={handleExit}
			onExited={handleExited}
			onExiting={handleExiting}
			addEndListener={handleAddEndListener}
			timeout={timeout}
			{...other}
		>
			{(state, childProps) => {
				return cloneElement(children, {
					style: {
						opacity: 0,
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

export default Fade
