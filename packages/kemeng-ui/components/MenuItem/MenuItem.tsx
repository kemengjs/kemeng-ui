import { cx, styled } from '@linaria/atomic'
import { forwardRef, useRef } from 'react'
import ButtonBase from '../Button/ButtonBase'
import { themeVariables } from '../../utils'
import { getK, unit } from '../../utils/style'
import {
	NativeJSXElementsWithoutRef,
	withNativeElementProps
} from '../../utils/nativeProps'
import useEnhancedEffect from '../../hooks/useEnhancedEffect'
import { useForkRef } from '../../hooks/useForkRef'

export type MenuItemProps = {
	autoFocus?: boolean
	dense?: boolean
	divider?: boolean
	disableGutters?: boolean
	focusVisibleClassName?: string
	disabled?: boolean
	selected?: boolean
} & NativeJSXElementsWithoutRef<'li'>

const k = getK('menuItem')

const MenuItemRoot = styled(ButtonBase)<MenuItemProps>`
	font-weight: ${themeVariables.typographyBody1.fontWeight};
	font-size: ${themeVariables.typographyBody1.fontSize};
	line-height: ${themeVariables.typographyBody1.lineHeight};
	letter-spacing: ${themeVariables.typographyBody1.letterSpacing};
	display: flex;
	justify-content: flex-start;
	align-items: center;
	position: relative;
	text-decoration: none;
	min-height: 48px;
	padding-top: 6px;
	padding-bottom: 6px;
	box-sizing: border-box;
	white-space: nowrap;
	&.${k('gutters')} {
		padding-left: ${unit(2)};
		padding-right: ${unit(2)};
	}

	&.${k('divider')} {
		border-bottom: 1px solid ${themeVariables.divider};
		background-clip: padding-box;
	}

	&:hover {
		text-decoration: none;
		background-color: ${themeVariables.action.hover};
		@media (hover: none) {
			background-color: transparent;
		}
	}

	&.${k('selected')} {
		background-color: rgba(
			${themeVariables.primary.mainRgb},
			${themeVariables.action.selectedOpacity}
		);

		&.${k('focusVisible')} {
			background-color: rgba(
				${themeVariables.primary.mainRgb},
				calc(
					${themeVariables.action.selectedOpacity} +
						${themeVariables.action.focusOpacity}
				)
			);
		}

		&:hover {
			background-color: rgba(
				${themeVariables.primary.mainRgb},
				calc(
					${themeVariables.action.selectedOpacity} +
						${themeVariables.action.hoverOpacity}
				)
			);

			@media (hover: none) {
				background-color: rgba(
					${themeVariables.primary.mainRgb},
					${themeVariables.action.selectedOpacity}
				);
			}
		}
	}

	&.${k('focusVisible')} {
		background-color: ${themeVariables.action.focus};
	}

	&.${k('disabled')} {
		opacity: ${themeVariables.action.disabledOpacity};
	}

	&.${k('dense')} {
		min-height: 32px;
		padding-top: 4px;
		padding-bottom: 4px;
		font-weight: ${themeVariables.typographyBody2.fontWeight};
		font-size: ${themeVariables.typographyBody2.fontSize};
		line-height: ${themeVariables.typographyBody2.lineHeight};
		letter-spacing: ${themeVariables.typographyBody2.letterSpacing};
	}
`

const MenuItem = forwardRef<HTMLLIElement, MenuItemProps>((p, ref) => {
	const {
		autoFocus = false,
		dense = false,
		divider = false,
		disableGutters = false,
		focusVisibleClassName,
		disabled = false,
		selected = false,
		tabIndex: tabIndexProp
	} = p

	const menuItemRef = useRef(null)
	useEnhancedEffect(() => {
		if (autoFocus) {
			if (menuItemRef.current) {
				menuItemRef.current.focus()
			} else if (process.env.NODE_ENV !== 'production') {
				console.error(
					'Unable to set focus to a MenuItem whose component has not been rendered.'
				)
			}
		}
	}, [autoFocus])

	const handleRef = useForkRef(menuItemRef, ref)

	let tabIndex: number
	if (!disabled) {
		tabIndex = tabIndexProp !== undefined ? tabIndexProp : -1
	}

	return withNativeElementProps(
		p,
		<MenuItemRoot
			ref={handleRef}
			tabIndex={tabIndex}
			component='li'
			autoFocus={autoFocus}
			focusVisibleClassName={cx(k('focusVisible'), focusVisibleClassName)}
			className={cx(
				selected && k('selected'),
				dense && k('dense'),
				disabled && k('disabled'),
				divider && k('divider'),
				disableGutters && k('disableGutters')
			)}
		></MenuItemRoot>
	)
})

export default MenuItem
