import {
	Children,
	KeyboardEventHandler,
	forwardRef,
	isValidElement,
	useRef
} from 'react'
import MenuList, { MenuListActionRef, MenuListProps } from '../MenuList'
import { PaperProps } from '../Paper'
import { TransitionProps } from '../../utils'
import { styled } from '@linaria/atomic'
import Popover, { PopoverPaper, PopoverProps } from '../Popover'
import { useTheme } from '../ThemePrivder'
import { withNativeElementProps } from '../../utils/nativeProps'

const RTL_ORIGIN: PopoverProps['transformOrigin'] = {
	vertical: 'top',
	horizontal: 'right'
}

const LTR_ORIGIN: PopoverProps['transformOrigin'] = {
	vertical: 'top',
	horizontal: 'left'
}

const MenuRoot = styled(Popover)`
	outline: 0;
`

const MenuMenuList = styled(MenuList)`
	outline: 0;
`

export const MenuPaper = styled(PopoverPaper)`
	max-height: calc(100% - 96px);
	-webkit-overflow-scrolling: touch;
`

export type MenuProps = {
	anchorEl?: PopoverProps['anchorEl']
	autoFocus?: boolean
	disableAutoFocusItem?: boolean
	MenuListProps?: Partial<MenuListProps>
	onClose?: PopoverProps['onClose']
	open?: boolean
	PaperProps?: PaperProps
	transitionDuration?: TransitionProps['timeout'] | 'auto'
	TransitionProps?: TransitionProps
	variant?: 'menu' | 'selectedMenu'
}

const Menu = forwardRef<
	HTMLDivElement,
	MenuProps & Omit<PopoverProps, keyof MenuProps>
>((p, ref) => {
	const {
		autoFocus = true,
		disableAutoFocusItem = false,
		MenuListProps = {},
		onClose,
		open,
		PaperProps = {},
		transitionDuration = 'auto',
		children,
		TransitionProps: { onEntering, ...TransitionProps } = {},
		variant = 'selectedMenu'
	} = p

	const { theme } = useTheme()
	const isRtl = theme.rtl === 'rtl'

	const autoFocusItem = autoFocus && !disableAutoFocusItem && open

	const menuListActionsRef: MenuListActionRef = useRef(null)

	const handleEntering = (element: HTMLElement, isAppearing: boolean) => {
		if (menuListActionsRef.current) {
			menuListActionsRef.current.adjustStyleForScrollbar(element, {
				direction: isRtl ? 'rtl' : 'ltr'
			})
		}

		if (onEntering) {
			onEntering(element, isAppearing)
		}
	}

	const handleListKeyDown: KeyboardEventHandler<HTMLUListElement> = event => {
		if (event.key === 'Tab') {
			event.preventDefault()

			if (onClose) {
				onClose(event, 'tabKeyDown')
			}
		}
	}

	let activeItemIndex = -1

	Children.map(children, (child, index) => {
		if (!isValidElement(child)) {
			return
		}

		if (!child.props.disabled) {
			if (variant === 'selectedMenu' && child.props.selected) {
				activeItemIndex = index
			} else if (activeItemIndex === -1) {
				activeItemIndex = index
			}
		}
	})

	return withNativeElementProps(
		p,
		<MenuRoot
			onClose={onClose}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: isRtl ? 'right' : 'left'
			}}
			transformOrigin={isRtl ? RTL_ORIGIN : LTR_ORIGIN}
			PaperProps={PaperProps}
			open={open}
			ref={ref}
			transitionDuration={transitionDuration}
			TransitionProps={{ onEntering: handleEntering, ...TransitionProps }}
		>
			{withNativeElementProps(
				MenuListProps,
				<MenuMenuList
					onKeyDown={handleListKeyDown}
					actionsRef={menuListActionsRef}
					autoFocus={
						autoFocus && (activeItemIndex === -1 || disableAutoFocusItem)
					}
					autoFocusItem={autoFocusItem}
					variant={variant}
				>
					{children}
				</MenuMenuList>
			)}
		</MenuRoot>
	)
})

export default Menu
