import {
	ComponentPropsWithRef,
	ElementType,
	ForwardRefExoticComponent
} from 'react'

// 数组根元素变幻时 可以使用
export type ForwardRefExoticComponentByPropsComponent<
	T,
	D extends ElementType = 'div'
> = T extends {
	component: infer C extends ElementType
}
	? ForwardRefExoticComponent<T & Omit<ComponentPropsWithRef<C>, keyof T>>
	: ForwardRefExoticComponent<T & Omit<ComponentPropsWithRef<D>, keyof T>>
