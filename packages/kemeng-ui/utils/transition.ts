import type { CSSProperties, HTMLAttributes } from 'react'
import {
	TransitionProps as _TransitionProps,
	TransitionActions
} from 'react-transition-group/Transition'

export type TransitionHandlerKeys =
	| 'onEnter'
	| 'onEntering'
	| 'onEntered'
	| 'onExit'
	| 'onExiting'
	| 'onExited'
export type TransitionHandlerProps = Pick<
	_TransitionProps,
	TransitionHandlerKeys
>

export interface EasingProps {
	easing: string | { enter?: string; exit?: string }
}

export type TransitionKeys =
	| 'in'
	| 'mountOnEnter'
	| 'unmountOnExit'
	| 'timeout'
	| 'easing'
	| 'addEndListener'
	| TransitionHandlerKeys
export interface TransitionProps
	extends TransitionActions,
		Partial<Pick<_TransitionProps & EasingProps, TransitionKeys>>,
		HTMLAttributes<HTMLElement> {}

export const reflow = (node: Element) => node.scrollTop

type ComponentProps = {
	easing: string | { enter?: string; exit?: string } | undefined
	style:
		| (CSSProperties & {
				transitionDuration?: string
				transitionTimingFunction?: string
				transitionDelay?: string
		  })
		| undefined
	timeout: number | { enter?: number; exit?: number } | 'auto'
}

interface Options {
	mode: 'enter' | 'exit'
}

interface CustTransitionProps {
	duration: string | number
	easing: string | undefined
	delay: string | undefined
}

export function getTransitionProps(
	props: ComponentProps,
	options: Options
): CustTransitionProps {
	const { timeout, easing, style = {} } = props

	return {
		duration:
			style.transitionDuration ??
			(typeof timeout === 'number'
				? timeout
				: timeout === 'auto'
					? ''
					: timeout[options.mode] || 0),
		easing:
			style.transitionTimingFunction ??
			(typeof easing === 'object' ? easing[options.mode] : easing),
		delay: style.transitionDelay
	}
}
