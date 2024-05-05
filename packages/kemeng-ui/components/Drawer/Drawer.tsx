import { cx, styled } from '@linaria/atomic'
import Modal, { ModalProps } from '../Modal'
import { TransitionProps, themeVariables } from '../../utils'
import Paper, { PaperProps } from '../Paper'
import { getK } from '../../utils/style'
import Slide, { SlideProps } from '../Slide'
import { JSXElementConstructor, forwardRef, useEffect, useRef } from 'react'
import { useTheme } from '../ThemePrivder'
import { getTransitionNum } from '../ThemePrivder/createTransition'
import {
	withNativeElementProps,
	withNativeProps
} from '../../utils/nativeProps'

const DrawerRoot = styled(Modal)`
	z-index: ${themeVariables.zIndex.drawer};
`

const DrawerDockedRoot = styled.div`
	flex: 0 0 auto;
`

const k = getK('Drawer')

const DrawerPaper = styled(Paper)`
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	height: 100%;
	flex: 1 0 auto;
	z-index: ${themeVariables.zIndex.drawer};
	-webkit-overflow-scrolling: touch;
	position: fixed;
	top: 0;
	outline: 0;

	&.${k('left')} {
		left: 0;

		&.${k('notTemporary')} {
			border-right: 1px solid ${themeVariables.divider};
		}
	}

	&.${k('top')} {
		top: 0;
		left: 0;
		right: 0;
		height: auto;
		max-height: 100%;

		&.${k('notTemporary')} {
			border-bottom: 1px solid ${themeVariables.divider};
		}
	}

	&.${k('right')} {
		right: 0;

		&.${k('notTemporary')} {
			border-left: 1px solid ${themeVariables.divider};
		}
	}

	&.${k('bottom')} {
		top: auto;
		left: 0;
		bottom: 0;
		right: 0;
		height: auto;
		max-height: 100%;

		&.${k('notTemporary')} {
			border-top: 1px solid ${themeVariables.divider};
		}
	}
`

const oppositeDirection = {
	left: 'right',
	right: 'left',
	top: 'down',
	bottom: 'up'
}

export function isHorizontal(anchor: DrawerProps['anchor']) {
	return ['left', 'right'].indexOf(anchor) !== -1
}

export function getAnchor(
	{ direction }: { direction: 'rtl' | 'ltr' },
	anchor: DrawerProps['anchor']
) {
	return direction === 'rtl' && isHorizontal(anchor)
		? oppositeDirection[anchor]
		: anchor
}

export type DrawerProps = {
	/**
	 * Side from which the drawer will appear.
	 * @default 'left'
	 */
	anchor?: 'left' | 'top' | 'right' | 'bottom'
	/**
	 * The elevation of the drawer.
	 * @default 16
	 */
	elevation?: PaperProps['elevation']
	/**
	 * Callback fired when the component requests to be closed.
	 * The `reason` parameter can optionally be used to control the response to `onClose`.
	 *
	 * @param {object} event The event source of the callback.
	 * @param {string} reason Can be: `"escapeKeyDown"`, `"backdropClick"`.
	 */
	onClose?: ModalProps['onClose']
	open?: boolean
	/**
	 * Props applied to the [`Paper`](/material-ui/api/paper/) element.
	 * @default {}
	 */
	PaperProps?: Partial<PaperProps>
	SlideProps?: Partial<SlideProps>
	transitionDuration?: TransitionProps['timeout']
	/**
	 * The variant to use.
	 * @default 'temporary'
	 */
	variant?: 'permanent' | 'persistent' | 'temporary'
	TransitionComponent?: JSXElementConstructor<
		TransitionProps & { children: React.ReactElement<any, any> }
	>
}

const Drawer = forwardRef<
	HTMLDivElement,
	DrawerProps & Omit<ModalProps, keyof DrawerProps>
>((p, ref) => {
	const { theme } = useTheme()
	const isRtl = theme.rtl === 'rtl'
	const defaultTransitionDuration = {
		enter: getTransitionNum(theme.transition.enteringScreen),
		exit: getTransitionNum(theme.transition.leavingScreen)
	}

	const {
		anchor = 'left',
		BackdropProps,
		children,
		elevation = 16,
		hideBackdrop = false,
		onClose,
		open = false,
		PaperProps = {},
		SlideProps,
		// eslint-disable-next-line react/prop-types
		TransitionComponent = Slide,
		transitionDuration = defaultTransitionDuration,
		variant = 'temporary'
	} = p

	// Let's assume that the Drawer will always be rendered on user space.
	// We use this state is order to skip the appear transition during the
	// initial mount of the component.
	const mounted = useRef(false)
	useEffect(() => {
		mounted.current = true
	}, [])

	const anchorInvariant = getAnchor(
		{ direction: isRtl ? 'rtl' : 'ltr' },
		anchor
	)

	const drawer = withNativeProps(
		PaperProps,
		<DrawerPaper
			elevation={variant === 'temporary' ? elevation : 0}
			square
			className={cx(
				anchor === 'bottom'
					? k('bottom')
					: anchor === 'left'
						? k('left')
						: anchor === 'right'
							? k('right')
							: k('top'),
				variant !== 'temporary' && k('notTemporary')
			)}
		>
			{children}
		</DrawerPaper>
	)

	if (variant === 'permanent') {
		return withNativeElementProps(
			p,
			<DrawerDockedRoot ref={ref}>{drawer}</DrawerDockedRoot>
		)
	}

	const slidingDrawer = (
		<TransitionComponent
			in={open}
			direction={oppositeDirection[anchorInvariant]}
			timeout={transitionDuration}
			appear={mounted.current}
			{...SlideProps}
		>
			{drawer}
		</TransitionComponent>
	)

	if (variant === 'persistent') {
		return withNativeElementProps(
			p,
			<DrawerDockedRoot ref={ref}>{slidingDrawer}</DrawerDockedRoot>
		)
	}

	return withNativeElementProps(
		p,
		<DrawerRoot
			BackdropProps={{
				...BackdropProps,
				transitionDuration
			}}
			open={open}
			onClose={onClose}
			hideBackdrop={hideBackdrop}
			ref={ref}
		>
			{slidingDrawer}
		</DrawerRoot>
	)
})

export default Drawer
