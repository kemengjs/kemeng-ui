import { cx, styled } from '@linaria/atomic'
import { ElementType, ReactNode, forwardRef, ForwardedRef } from 'react'
import {
	NativeElementProps,
	withNativeElementProps
} from '../../utils/nativeProps'
import { getK, unit } from '../../utils/style'
import { themeVariables } from '../../utils'

export type ContainerProps = {
	as?: ElementType
	disableGutters?: boolean
	maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false | string
	children?: ReactNode
} & NativeElementProps

const k = getK('container')

const ContainerRoot = styled.div<ContainerProps>`
	width: 100%;
	margin-left: auto;
	margin-right: auto;
	box-sizing: border-box;
	display: block;

	max-width: ${({ maxWidth }) => {
		return maxWidth ? themeVariables.breakpoints[maxWidth] || maxWidth : 'none'
	}};

	&.${k('gutters')} {
		padding-left: ${unit(2)};
		padding-right: ${unit(2)};

		@media (min-width: 600px) {
			padding-left: ${unit(3)};
			padding-right: ${unit(3)};
		}
	}
`

const Container = forwardRef<HTMLDivElement, ContainerProps>((p, ref) => {
	const { as = 'div', disableGutters = false, maxWidth = 'lg', children } = p

	return withNativeElementProps(
		p,
		<ContainerRoot
			maxWidth={maxWidth}
			disableGutters={disableGutters}
			as={as}
			ref={ref as ForwardedRef<HTMLDivElement>}
			className={cx(!disableGutters && k('gutters'))}
		>
			{children}
		</ContainerRoot>
	)
})

export default Container
