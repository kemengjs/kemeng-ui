import { cx } from '@linaria/atomic'
import React, { cloneElement } from 'react'
import type { AnchorHTMLAttributes, CSSProperties, ReactElement } from 'react'

export type NativeProps<S extends string = never> = {
	className?: string
	style?: CSSProperties & Partial<Record<S, string>>
}

export function withNativeProps<P extends NativeProps>(
	props: P,
	element: ReactElement
) {
	const p = {
		...element.props
	}
	if (props.className) {
		p.className = cx(element.props.className, props.className)
	}
	if (props.style) {
		p.style = {
			...element.props.style,
			...props.style
		}
	}

	return cloneElement(element, p)
}

export type NativeElementProps = Omit<AnchorHTMLAttributes<Element>, 'ref'>

export function withNativeElementProps<P extends NativeElementProps>(
	props: P,
	element: ReactElement
) {
	const p = {
		...props,
		...element.props
	}
	if (props.className) {
		p.className = cx(element.props.className, props.className)
	}
	if (props.style) {
		p.style = {
			...element.props.style,
			...props.style
		}
	}

	return cloneElement(element, p)
}

export type NativeJSXElementsWithoutRef<T extends keyof JSX.IntrinsicElements> =
	Omit<JSX.IntrinsicElements[T], 'ref'>

export function withNativeContextProps<P extends NativeElementProps>(
	props: P,
	element: ReactElement
) {
	const elementProps = element.props.children.props
	const p = {
		...props,
		...elementProps
	}
	if (props.className) {
		p.className = cx(elementProps.className, props.className)
	}
	if (props.style) {
		p.style = {
			...elementProps.style,
			...props.style
		}
	}

	const contextProps = {
		...element.props,
		children: {
			...element.props.children,
			props: p
		}
	}

	return cloneElement(element, contextProps)
}

export function withComponentToAs(as: ReactElement, element: ReactElement) {
	const p = {
		...element.props
	}
	console.log('as.props.className, element.props.className', as, element)
	p.className = cx(as.props.className, element.props.className)
	p.style = {
		...(as.props.style || {}),
		...(element.props.style || {})
	}

	return cloneElement(as, p)
}
