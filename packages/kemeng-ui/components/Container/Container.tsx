import { cx, styled } from '@linaria/atomic'
import { ElementType, ReactNode, forwardRef, ForwardedRef } from 'react'
import { NativeElementProps, withNativeProps } from '../../utils/nativeProps'
import { getK } from '../../utils/style'
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
		padding-left: calc(${themeVariables.spacing} * 2);
		padding-right: calc(${themeVariables.spacing} * 2);

		@media (min-width: 600px) {
			padding-left: calc(${themeVariables.spacing} * 3);
			padding-right: calc(${themeVariables.spacing} * 3);
		}
	}
`

const Container = forwardRef<HTMLDivElement, ContainerProps>((p, ref) => {
	const {
		as = 'div',
		disableGutters = false,
		maxWidth = 'lg',
		children,
		...other
	} = p

	return withNativeProps(
		p,
		<ContainerRoot
			maxWidth={maxWidth}
			disableGutters={disableGutters}
			as={as}
			ref={ref as ForwardedRef<HTMLDivElement>}
			className={cx(!disableGutters && k('gutters'))}
			{...other}
		>
			{children}
		</ContainerRoot>
	)
})

export default Container
