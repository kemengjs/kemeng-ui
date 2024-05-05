import { ReactNode, forwardRef, useMemo } from 'react'
import {
	NativeJSXElementsWithoutRef,
	withNativeContextProps
} from '../../utils/nativeProps'
import { cx, styled } from '@linaria/atomic'
import { getK, unit } from '../../utils/style'
import ListContext from './ListContext'

export type ListProps = {
	dense?: boolean
	disablePadding?: boolean
	subheader?: ReactNode
} & NativeJSXElementsWithoutRef<'ul'>

const k = getK('List')

const ListRoot = styled.ul<ListProps>`
	list-style: none;
	margin: 0;
	padding: 0;
	position: relative;

	&.${k('padding')} {
		padding-top: ${unit(1)};
		padding-bottom: ${unit(1)};
	}
	&.${k('subheader')} {
		padding-top: 0;
	}
`

const List = forwardRef<HTMLUListElement, ListProps>((p, ref) => {
	const { dense = false, disablePadding = false, subheader, children } = p

	const context = useMemo(() => ({ dense }), [dense])

	return withNativeContextProps(
		p,
		<ListContext.Provider value={context}>
			<ListRoot
				className={cx(
					!disablePadding && k('padding'),
					subheader && k('subheader')
				)}
				ref={ref}
			>
				{subheader}
				{children}
			</ListRoot>
		</ListContext.Provider>
	)
})

export default List
