import { cx, styled } from '@linaria/atomic'
import { getK } from '../../utils/style'
import { forwardRef } from 'react'
import {
	NativeJSXElementsWithoutRef,
	withNativeElementProps
} from '../../utils/nativeProps'
import { themeVariables } from '../../utils'

const k = getK('Grid')

export type BreakPointMap<T> =
	| {
			xs?: T | null | undefined
			sm?: T | null | undefined
			md?: T | null | undefined
			lg?: T | null | undefined
			xl?: T | null | undefined
	  }
	| T

export type GridProps = {
	container?: boolean
	xs?: number
	sm?: number
	md?: number
	lg?: number
	xl?: number
	/**
	 * The number of columns.
	 * @default 12
	 */
	columns?: number
	columnSpacing?: BreakPointMap<number>
	rowSpacing?: BreakPointMap<number>
	spacing?: BreakPointMap<number>
	direction?: BreakPointMap<'row' | 'row-reverse' | 'column' | 'column-reverse'>
	/**
	 * Defines the `flex-wrap` style property.
	 * It's applied for all screen sizes.
	 * @default 'wrap'
	 */
	wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
} & NativeJSXElementsWithoutRef<'div'>

const GridContainerRoot = styled.div<GridProps>`
	display: flex;
	flex-wrap: ${({ wrap }) => wrap};
	box-sizing: border-box;
	min-width: 0px;
	flex-direction: row;
	margin: calc(${themeVariables.grid.rowSpacing} / -2)
		calc(${themeVariables.grid.columnSpacing} / -2);
`
const GridItemRoot = styled.div<GridProps>`
	display: flex;
	box-sizing: border-box;
	min-width: 0px;
	margin: calc(${themeVariables.grid.rowSpacing} / 2)
		calc(${themeVariables.grid.columnSpacing} / 2);
	width: ${({ xs, columns }) => {
		return `calc(100% * ${xs} / ${columns})`
	}};

	&.${k('sm')} {
		@media (min-width: 600px) {
			width: ${({ sm, columns }) => {
				return `calc(100% * ${sm} / ${columns})`
			}};

			&.${k('auto')} {
				width: auto;
			}
		}
	}
	&.${k('md')} {
		@media (min-width: 900px) {
			width: ${({ md, columns }) => {
				return `calc(100% * ${md} / ${columns})`
			}};
		}
	}
	&.${k('lg')} {
		@media (min-width: 1200px) {
			width: ${({ lg, columns }) => {
				return `calc(100% * ${lg} / ${columns})`
			}};
		}
	}
	&.${k('xl')} {
		@media (min-width: 1536px) {
			width: ${({ xl, columns }) => {
				return `calc(100% * ${xl} / ${columns})`
			}};
		}
	}
`

const Grid = forwardRef<HTMLDivElement, GridProps>((p, ref) => {
	const {
		container = false,
		xs = 1,
		sm = 1,
		md = 1,
		lg = 1,
		xl = 1,
		columnSpacing,
		rowSpacing,
		spacing,
		direction = 'row',
		columns = 12,
		wrap = 'wrap'
	} = p

	return container
		? withNativeElementProps(
				p,
				<GridContainerRoot
					wrap={wrap}
					className={cx(!false && k('notDisableSpacing'))}
					ref={ref}
				/>
			)
		: withNativeElementProps(
				p,
				<GridItemRoot
					xs={xs}
					className={cx(!false && k('notDisableSpacing'))}
					ref={ref}
					columns={columns}
				/>
			)
})

export default Grid
