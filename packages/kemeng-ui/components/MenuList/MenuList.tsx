import {
	Children,
	KeyboardEvent,
	ReactElement,
	Ref,
	cloneElement,
	forwardRef,
	isValidElement,
	useImperativeHandle,
	useRef
} from 'react'
import {
	NativeJSXElementsWithoutRef,
	withNativeElementProps
} from '../../utils/nativeProps'
import List from '../List'
import { useForkRef } from '../../hooks/useForkRef'
import useEnhancedEffect from '../../hooks/useEnhancedEffect'
import { ownerDocument } from '../../utils/ownerDocument'
import { getScrollbarSize } from '../../utils/getScrollbarSize'

type SelectItemElement = Element & {
	disabled?: boolean
	focus?: () => void
}

type SelectItemFuc = (
	list: HTMLUListElement,
	currentFocus: Element,
	disableListWrap: boolean
) => null | SelectItemElement

/**
 *
 * @param list list容器元素
 * @param item 当前激活元素 document上的activeElement 用户点击等触发的激活元素
 * @param disableListWrap 是否禁用list包裹 用于要不要返回第一个子元素
 * @returns 返回下一个元素
 */
const nextItem: SelectItemFuc = (list, item, disableListWrap) => {
	if (list === item) {
		return list.firstChild as Element
	}
	if (item && item.nextElementSibling) {
		return item.nextElementSibling
	}
	return disableListWrap ? null : (list.firstChild as Element)
}

const previousItem: SelectItemFuc = (list, item, disableListWrap) => {
	if (list === item) {
		return (disableListWrap ? list.firstChild : list.lastChild) as Element
	}
	if (item && item.previousElementSibling) {
		return item.previousElementSibling
	}
	return disableListWrap ? null : (list.lastChild as Element)
}

function textCriteriaMatches(
	nextFocus: HTMLElement,
	textCriteria: TextCriteria
) {
	if (textCriteria === undefined) {
		return true
	}
	let text = nextFocus.innerText
	if (text === undefined) {
		// jsdom doesn't support innerText
		text = nextFocus.textContent
	}
	text = text.trim().toLowerCase()
	if (text.length === 0) {
		return false
	}
	if (textCriteria.repeating) {
		return text[0] === textCriteria.keys[0]
	}
	return text.indexOf(textCriteria.keys.join('')) === 0
}

function moveFocus(
	list: HTMLUListElement,
	currentFocus: Element,
	disableListWrap: boolean,
	disabledItemsFocusable: boolean,
	traversalFunction: SelectItemFuc,
	textCriteria?: TextCriteria
) {
	let wrappedOnce = false
	let nextFocus = traversalFunction(
		list,
		currentFocus,
		currentFocus ? disableListWrap : false
	)

	while (nextFocus) {
		// Prevent infinite loop.
		if (nextFocus === list.firstChild) {
			if (wrappedOnce) {
				return false
			}
			wrappedOnce = true
		}

		// Same logic as useAutocomplete.js
		const nextFocusDisabled = disabledItemsFocusable
			? false
			: nextFocus.disabled || nextFocus.getAttribute('aria-disabled') === 'true'

		if (
			!nextFocus.hasAttribute('tabindex') ||
			!textCriteriaMatches(nextFocus as HTMLElement, textCriteria) ||
			nextFocusDisabled
		) {
			// Move to the next element.
			nextFocus = traversalFunction(list, nextFocus, disableListWrap)
		} else {
			nextFocus.focus?.()
			return true
		}
	}
	return false
}

export type MenuListActionRef = Ref<{
	adjustStyleForScrollbar: (
		containerElement: Element,
		options: { direction?: 'rtl' | 'ltr' }
	) => HTMLUListElement
}>

export type MenuListProps = {
	actionsRef?: MenuListActionRef
	autoFocus?: boolean
	autoFocusItem?: boolean
	disabledItemsFocusable?: boolean
	disableListWrap?: boolean
	variant?: 'selectedMenu' | 'menu'
} & NativeJSXElementsWithoutRef<'ul'>

export type TextCriteria = {
	keys: string[]
	repeating: boolean
	previousKeyMatched: boolean
	lastTime: any
}

const MenuList = forwardRef<HTMLUListElement, MenuListProps>((p, ref) => {
	const {
		// private
		// eslint-disable-next-line react/prop-types
		actionsRef,
		autoFocus = false,
		autoFocusItem = false,
		disabledItemsFocusable = false,
		disableListWrap = false,
		onKeyDown,
		variant = 'selectedMenu'
	} = p

	const children = p.children as ReactElement<{
		muiSkipListHighlight: boolean
		disabled: boolean
		autoFocus: boolean
		tabIndex: number
		selected: boolean
	}>[]

	const listRef = useRef<HTMLUListElement>(null)
	const textCriteriaRef = useRef<TextCriteria>({
		keys: [],
		repeating: true,
		previousKeyMatched: true,
		lastTime: null
	})

	useEnhancedEffect(() => {
		if (autoFocus) {
			listRef.current.focus()
		}
	}, [autoFocus])

	useImperativeHandle(
		actionsRef,
		() => ({
			adjustStyleForScrollbar: (containerElement, { direction }) => {
				// Let's ignore that piece of logic if users are already overriding the width
				// of the menu.
				const noExplicitWidth = !listRef.current.style.width
				if (
					containerElement.clientHeight < listRef.current.clientHeight &&
					noExplicitWidth
				) {
					const scrollbarSize = `${getScrollbarSize(ownerDocument(containerElement))}px`
					listRef.current.style[
						direction === 'rtl' ? 'paddingLeft' : 'paddingRight'
					] = scrollbarSize
					listRef.current.style.width = `calc(100% + ${scrollbarSize})`
				}
				return listRef.current
			}
		}),
		[]
	)

	const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
		const list = listRef.current
		const key = event.key

		const currentFocus = ownerDocument(list).activeElement

		if (key === 'ArrowDown') {
			// Prevent scroll of the page
			event.preventDefault()
			moveFocus(
				list,
				currentFocus,
				disableListWrap,
				disabledItemsFocusable,
				nextItem
			)
		} else if (key === 'ArrowUp') {
			event.preventDefault()
			moveFocus(
				list,
				currentFocus,
				disableListWrap,
				disabledItemsFocusable,
				previousItem
			)
		} else if (key === 'Home') {
			event.preventDefault()
			moveFocus(list, null, disableListWrap, disabledItemsFocusable, nextItem)
		} else if (key === 'End') {
			event.preventDefault()
			moveFocus(
				list,
				null,
				disableListWrap,
				disabledItemsFocusable,
				previousItem
			)
		} else if (key.length === 1) {
			const criteria = textCriteriaRef.current
			const lowerKey = key.toLowerCase()
			const currTime = performance.now()
			if (criteria.keys.length > 0) {
				// Reset
				if (currTime - criteria.lastTime > 500) {
					criteria.keys = []
					criteria.repeating = true
					criteria.previousKeyMatched = true
				} else if (criteria.repeating && lowerKey !== criteria.keys[0]) {
					criteria.repeating = false
				}
			}
			criteria.lastTime = currTime
			criteria.keys.push(lowerKey)
			const keepFocusOnCurrent =
				currentFocus &&
				!criteria.repeating &&
				textCriteriaMatches(currentFocus as HTMLElement, criteria)
			if (
				criteria.previousKeyMatched &&
				(keepFocusOnCurrent ||
					moveFocus(
						list,
						currentFocus,
						false,
						disabledItemsFocusable,
						nextItem,
						criteria
					))
			) {
				event.preventDefault()
			} else {
				criteria.previousKeyMatched = false
			}
		}

		if (onKeyDown) {
			onKeyDown(event)
		}
	}

	const handleRef = useForkRef(listRef, ref)

	let activeItemIndex = -1

	Children.forEach(children, (child, index) => {
		if (!isValidElement(child)) {
			if (activeItemIndex === index) {
				activeItemIndex += 1
				if (activeItemIndex >= children.length) {
					// there are no focusable items within the list.
					activeItemIndex = -1
				}
			}
			return
		}

		if (!child.props.disabled) {
			if (variant === 'selectedMenu' && child.props.selected) {
				activeItemIndex = index
			} else if (activeItemIndex === -1) {
				activeItemIndex = index
			}
		}

		if (
			activeItemIndex === index &&
			(child.props.disabled ||
				child.props.muiSkipListHighlight ||
				(
					child.type as unknown as {
						muiSkipListHighlight: boolean
					}
				).muiSkipListHighlight)
		) {
			activeItemIndex += 1
			if (activeItemIndex >= children.length) {
				// there are no focusable items within the list.
				activeItemIndex = -1
			}
		}
	})

	const items = Children.map(children, (child, index) => {
		if (index === activeItemIndex) {
			const newChildProps: {
				autoFocus?: boolean
				tabIndex?: number
			} = {}
			if (autoFocusItem) {
				newChildProps.autoFocus = true
			}

			if (child.props.tabIndex === undefined && variant === 'selectedMenu') {
				newChildProps.tabIndex = 0
			}

			return cloneElement(child, newChildProps)
		}

		return child
	})

	return withNativeElementProps(
		p,
		<List
			ref={handleRef}
			onKeyDown={handleKeyDown}
			tabIndex={autoFocus ? 0 : -1}
		>
			{items}
		</List>
	)
})

export default MenuList
