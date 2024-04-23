import { cx } from '@linaria/atomic'
import React from 'react'
import type { CSSProperties, ReactElement } from 'react'

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
			...p.style,
			...props.style
		}
	}

	return React.cloneElement(element, p)
}
