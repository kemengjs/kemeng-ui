import { cx, styled } from '@linaria/atomic'
import { getK } from '../../utils/style'
import { forwardRef } from 'react'
import {
	NativeJSXElementsWithoutRef,
	withNativeElementProps
} from '../../utils/nativeProps'

const k = getK('Grid')

const GridRoot = styled.div`
	display: flex;
	align-items: center;
	padding: 8px;
	justify-content: flex-end;
	flex: 0 0 auto;

	&.${k('notDisableSpacing')} {
		& > :not(style) ~ :not(style) {
			margin-left: 8px;
		}
	}
`

export type GridProps = {
	disableSpacing?: boolean
} & NativeJSXElementsWithoutRef<'div'>

const Grid = forwardRef<HTMLDivElement, GridProps>((p, ref) => {
	const { disableSpacing = false } = p

	return withNativeElementProps(
		p,
		<GridRoot
			className={cx(!disableSpacing && k('notDisableSpacing'))}
			ref={ref}
		/>
	)
})

export default Grid
