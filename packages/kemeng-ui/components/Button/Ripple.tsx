import { cx } from '@linaria/atomic'
import { FC, useEffect, useState } from 'react'
import { NativeProps, withNativeProps } from '../../utils/nativeProps'

type RippleProps = {
	classes: Record<string, string>
	in?: boolean
	onExited?: () => void
	pulsate?: boolean
	rippleSize?: number
	rippleX?: number
	rippleY?: number
	timeout: number
} & NativeProps

const Ripple: FC<RippleProps> = props => {
	const {
		classes,
		pulsate = false,
		rippleX,
		rippleY,
		rippleSize,
		in: inProp,
		onExited,
		timeout
	} = props
	const [leaving, setLeaving] = useState(false)

	const rippleClassName = cx(
		classes.ripple,
		classes.rippleVisible,
		pulsate && classes.ripplePulsate
	)

	const rippleStyles = {
		width: rippleSize,
		height: rippleSize,
		top: -(rippleSize / 2) + rippleY,
		left: -(rippleSize / 2) + rippleX
	}

	const childClassName = cx(
		classes.child,
		leaving && classes.childLeaving,
		pulsate && classes.childPulsate
	)

	if (!inProp && !leaving) {
		setLeaving(true)
	}
	useEffect(() => {
		if (!inProp && onExited != null) {
			// react-transition-group#onExited
			const timeoutId = setTimeout(onExited, timeout)
			return () => {
				clearTimeout(timeoutId)
			}
		}
		return undefined
	}, [onExited, inProp, timeout])
	return withNativeProps(
		props,
		<span className={rippleClassName} style={rippleStyles}>
			<span className={childClassName} />
		</span>
	)
}

export default Ripple
