import { ReactNode, forwardRef } from 'react'
import { TransitionProps } from '../../utils'
import Fade from '../Fade'
import { cx, styled } from '@linaria/atomic'
import { getK } from '../../utils/style'
import { NativeJSXElementsWithoutRef } from '../../utils/nativeProps'

const k = getK('Backdrop')

const BackdropRoot = styled.div<BackdropProps>`
	position: fixed;
	display: flex;
	align-items: center;
	justify-content: center;
	right: 0;
	bottom: 0;
	left: 0;
	top: 0;
	background-color: rgba(0, 0, 0, 0.5);
	-webkit-tap-highlight-color: transparent;

	&.${k('invisible')} {
		background-color: transparent;
	}
`

export type BackdropProps = {
	invisible?: boolean
	open?: boolean
	transitionDuration?: TransitionProps['timeout']
	children?: ReactNode
} & NativeJSXElementsWithoutRef<'div'>

const Backdrop = forwardRef<HTMLDivElement, BackdropProps>((p, ref) => {
	const {
		children,
		invisible = false,
		open,
		transitionDuration,
		className,
		...other
	} = p

	return (
		<Fade in={open} timeout={transitionDuration}>
			<BackdropRoot
				aria-hidden
				ref={ref}
				className={cx(invisible && k('invisible'), className)}
				{...other}
			>
				{children}
			</BackdropRoot>
		</Fade>
	)
})

export default Backdrop
