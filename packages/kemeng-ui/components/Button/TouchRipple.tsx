import { cx, styled } from '@linaria/atomic'
import {
	ReactElement,
	SyntheticEvent,
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState
} from 'react'
import Ripple from './Ripple'
import { k } from '../../utils/style'
import { TransitionGroup } from 'react-transition-group'
import { useTimeout } from '../../hooks/useTimeout'

const DURATION = 550
export const DELAY_RIPPLE = 80

const RpplePulsateDuration = 200

const TouchRippleRoot = styled.span`
	overflow: hidden;
	pointer-events: none;
	position: absolute;
	z-index: 0;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	border-radius: inherit;
`

export const TouchRippleRipple = styled(Ripple)`
	@keyframes enterKeyframe {
		0% {
			transform: scale(0);
			opacity: 0.1;
		}

		100% {
			transform: scale(1);
			opacity: 0.3;
		}
	}

	@keyframes exitKeyframe {
		0% {
			opacity: 1;
		}

		100% {
			opacity: 0;
		}
	}

	@keyframes pulsateKeyframe {
		0% {
			transform: scale(1);
		}

		50% {
			transform: scale(0.92);
		}

		100% {
			transform: scale(1);
		}
	}

	opacity: 0;
	position: absolute;

	&.${k('rippleVisible')} {
		opacity: 0.3;
		transform: scale(1);
		animation-name: enterKeyframe;
		animation-duration: ${DURATION}ms;
		animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	}

	&.${k('ripplePulsate')} {
		animation-duration: ${RpplePulsateDuration}ms;
	}

	& .${k('child')} {
		opacity: 1;
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background-color: currentColor;
	}

	& .${k('childLeaving')} {
		opacity: 0;
		animation-name: exitKeyframe;
		animation-duration: ${DURATION}ms;
		animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	}

	& .${k('childPulsate')} {
		position: absolute;
		/* @noflip */
		left: 0px;
		top: 0;
		animation-name: pulsateKeyframe;
		animation-duration: 2500ms;
		animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		animation-iteration-count: infinite;
		animation-delay: 200ms;
	}
`

export type TouchRippleProps = {
	center?: boolean
	classes?: Record<string, string>
	className?: string
}
export interface StartActionOptions {
	pulsate?: boolean
	center?: boolean
	fakeElement?: boolean
}

export type TouchMouseEvent = TouchEvent & MouseEvent

export type TouchRippleRef = {
	start: (
		event?: TouchMouseEvent,
		options?: StartActionOptions,
		callback?: () => void
	) => void
	pulsate: (event?: SyntheticEvent) => void
	stop: (event?: SyntheticEvent, callback?: () => void) => void
}

const TouchRipple = forwardRef<TouchRippleRef, TouchRippleProps>(
	(props, ref) => {
		const {
			center: centerProp = false,
			classes = {},
			className,
			...other
		} = props
		const [ripples, setRipples] = useState<ReactElement[]>([])
		const nextKey = useRef(0)
		const rippleCallback = useRef(null)

		useEffect(() => {
			if (rippleCallback.current) {
				rippleCallback.current()
				rippleCallback.current = null
			}
		}, [ripples])

		// Used to filter out mouse emulated events on mobile.
		const ignoringMouseDown = useRef(false)
		// We use a timer in order to only show the ripples for touch "click" like events.
		// We don't want to display the ripple for touch scroll events.
		const startTimer = useTimeout()

		// This is the hook called once the previous timeout is ready.
		const startTimerCommit = useRef(null)
		const container = useRef<HTMLSpanElement>(null)

		const startCommit = useCallback(
			(params: {
				pulsate: boolean
				rippleX: number
				rippleY: number
				rippleSize: number
				cb: () => void
			}) => {
				const { pulsate, rippleX, rippleY, rippleSize, cb } = params

				setRipples(oldRipples => [
					...oldRipples,
					<TouchRippleRipple
						key={nextKey.current}
						classes={{
							ripple: cx(classes.ripple, k('ripple')),
							rippleVisible: cx(classes.rippleVisible, k('rippleVisible')),
							ripplePulsate: cx(classes.ripplePulsate, k('ripplePulsate')),
							child: cx(classes.child, k('child')),
							childLeaving: cx(classes.childLeaving, k('childLeaving')),
							childPulsate: cx(classes.childPulsate, k('childPulsate'))
						}}
						timeout={DURATION}
						pulsate={pulsate}
						rippleX={rippleX}
						rippleY={rippleY}
						rippleSize={rippleSize}
					/>
				])
				nextKey.current += 1
				rippleCallback.current = cb
			},
			[classes]
		)

		const start = useCallback<TouchRippleRef['start']>(
			(event = {} as TouchMouseEvent, options = {}, cb = () => {}) => {
				const {
					pulsate = false,
					center = centerProp || options.pulsate,
					fakeElement = false // For test purposes
				} = options

				if (event?.type === 'mousedown' && ignoringMouseDown.current) {
					ignoringMouseDown.current = false
					return
				}

				if (event?.type === 'touchstart') {
					ignoringMouseDown.current = true
				}

				const element = fakeElement ? null : container.current
				const rect = element
					? element.getBoundingClientRect()
					: {
							width: 0,
							height: 0,
							left: 0,
							top: 0
						}

				// Get the size of the ripple
				let rippleX: number
				let rippleY: number
				let rippleSize: number

				if (
					center ||
					event === undefined ||
					(event.clientX === 0 && event.clientY === 0) ||
					(!event.clientX && !event.touches)
				) {
					rippleX = Math.round(rect.width / 2)
					rippleY = Math.round(rect.height / 2)
				} else {
					const { clientX, clientY } =
						event.touches && event.touches.length > 0 ? event.touches[0] : event
					rippleX = Math.round(clientX - rect.left)
					rippleY = Math.round(clientY - rect.top)
				}

				if (center) {
					rippleSize = Math.sqrt((2 * rect.width ** 2 + rect.height ** 2) / 3)

					// For some reason the animation is broken on Mobile Chrome if the size is even.
					if (rippleSize % 2 === 0) {
						rippleSize += 1
					}
				} else {
					const sizeX =
						Math.max(
							Math.abs((element ? element.clientWidth : 0) - rippleX),
							rippleX
						) *
							2 +
						2
					const sizeY =
						Math.max(
							Math.abs((element ? element.clientHeight : 0) - rippleY),
							rippleY
						) *
							2 +
						2
					rippleSize = Math.sqrt(sizeX ** 2 + sizeY ** 2)
				}

				// Touche devices
				if (event?.touches) {
					// check that this isn't another touchstart due to multitouch
					// otherwise we will only clear a single timer when unmounting while two
					// are running
					if (startTimerCommit.current === null) {
						// Prepare the ripple effect.
						startTimerCommit.current = () => {
							startCommit({ pulsate, rippleX, rippleY, rippleSize, cb })
						}
						// Delay the execution of the ripple effect.
						// We have to make a tradeoff with this delay value.
						startTimer.start(DELAY_RIPPLE, () => {
							if (startTimerCommit.current) {
								startTimerCommit.current()
								startTimerCommit.current = null
							}
						})
					}
				} else {
					startCommit({ pulsate, rippleX, rippleY, rippleSize, cb })
				}
			},
			[centerProp, startCommit, startTimer]
		)

		const pulsate = useCallback(() => {
			start({} as TouchMouseEvent, { pulsate: true })
		}, [start])

		const stop = useCallback<TouchRippleRef['stop']>(
			(event, cb) => {
				startTimer.clear()

				// The touch interaction occurs too quickly.
				// We still want to show ripple effect.
				if (event?.type === 'touchend' && startTimerCommit.current) {
					startTimerCommit.current()
					startTimerCommit.current = null
					startTimer.start(0, () => {
						stop(event, cb)
					})
					return
				}

				startTimerCommit.current = null

				setRipples(oldRipples => {
					if (oldRipples.length > 0) {
						return oldRipples.slice(1)
					}
					return oldRipples
				})
				rippleCallback.current = cb
			},
			[startTimer]
		)

		useImperativeHandle(
			ref,
			() => ({
				pulsate,
				start,
				stop
			}),
			[pulsate, start, stop]
		)

		return (
			<TouchRippleRoot
				className={cx(k('root, classes.root, className'))}
				ref={container}
				{...other}
			>
				<TransitionGroup component={null} exit>
					{ripples}
				</TransitionGroup>
			</TouchRippleRoot>
		)
	}
)

export default TouchRipple
