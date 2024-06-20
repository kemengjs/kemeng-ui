import { cx, styled } from '@linaria/atomic'
import { getK } from '../../utils/style'
import { forwardRef, useMemo } from 'react'
import {
	NativeJSXElementsWithoutRef,
	withNativeElementProps
} from '../../utils/nativeProps'
import { themeVariables } from '../../utils'
import { isObject, isNumber, isBoolean } from '../../utils/validate'

const k = getK('Grid')

type BreakPointMap<T> = {
	xs?: T | null | undefined
	sm?: T | null | undefined
	md?: T | null | undefined
	lg?: T | null | undefined
	xl?: T | null | undefined
}
export type BreakPointMapAndOwn<T> = BreakPointMap<T> | T

type BreakPointItem = number | 'auto' | boolean

export type GridProps = {
	container?: boolean
	xs?: BreakPointItem
	sm?: BreakPointItem
	md?: BreakPointItem
	lg?: BreakPointItem
	xl?: BreakPointItem
	/**
	 * The number of columns.
	 * @default 12
	 */
	columns?: number
	columnSpacing?: BreakPointMapAndOwn<number>
	rowSpacing?: BreakPointMapAndOwn<number>
	spacing?: BreakPointMapAndOwn<number>
	direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
	/**
	 * Defines the `flex-wrap` style property.
	 * It's applied for all screen sizes.
	 * @default 'wrap'
	 */
	wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
} & NativeJSXElementsWithoutRef<'div'>

const GridContainerRoot = styled.div<GridProps>`
	--rowSpacingNum: ${({ rowSpacing }) =>
		(rowSpacing as BreakPointMap<number>).xs};
	--columnSpacingNum: ${({ columnSpacing }) =>
		(columnSpacing as BreakPointMap<number>).xs};
	display: flex;
	flex-wrap: ${({ wrap }) => wrap};
	box-sizing: border-box;
	min-width: 0px;
	flex-direction: ${({ direction }) => direction};
	margin: calc(${themeVariables.grid.rowSpacing} * (var(--rowSpacingNum)) / -2)
		calc(${themeVariables.grid.columnSpacing} * (var(--columnSpacingNum)) / -2);

	&.${k('smRowSpacing')} {
		@media (min-width: 600px) {
			--rowSpacingNum: ${({ rowSpacing }) =>
				(rowSpacing as BreakPointMap<number>).sm};
		}
	}

	&.${k('smColumnSpacing')} {
		@media (min-width: 600px) {
			--rowSpacingNum: ${({ columnSpacing }) =>
				(columnSpacing as BreakPointMap<number>).sm};
		}
	}

	&.${k('mdRowSpacing')} {
		@media (min-width: 900px) {
			--rowSpacingNum: ${({ rowSpacing }) =>
				(rowSpacing as BreakPointMap<number>).md};
		}
	}

	&.${k('mdColumnSpacing')} {
		@media (min-width: 900px) {
			--rowSpacingNum: ${({ columnSpacing }) =>
				(columnSpacing as BreakPointMap<number>).md};
		}
	}

	&.${k('lgRowSpacing')} {
		@media (min-width: 1200px) {
			--rowSpacingNum: ${({ rowSpacing }) =>
				(rowSpacing as BreakPointMap<number>).lg};
		}
	}

	&.${k('lgColumnSpacing')} {
		@media (min-width: 1200px) {
			--rowSpacingNum: ${({ columnSpacing }) =>
				(columnSpacing as BreakPointMap<number>).lg};
		}
	}

	&.${k('xlRowSpacing')} {
		@media (min-width: 1536px) {
			--rowSpacingNum: ${({ rowSpacing }) =>
				(rowSpacing as BreakPointMap<number>).xl};
		}
	}

	&.${k('xlColumnSpacing')} {
		@media (min-width: 1536px) {
			--rowSpacingNum: ${({ columnSpacing }) =>
				(columnSpacing as BreakPointMap<number>).xl};
		}
	}
`
const GridItemRoot = styled.div<GridProps>`
	box-sizing: border-box;
	min-width: 0px;
	padding: calc(${themeVariables.grid.rowSpacing} * (var(--rowSpacingNum)) / 2)
		calc(${themeVariables.grid.columnSpacing} * (var(--columnSpacingNum)) / 2);

	&.${k('xsnumorauto')} {
		width: ${({ xs, columns }) => {
			return xs === 'auto' ? 'auto' : `calc(100% * ${xs} / ${columns})`
		}};
	}

	&.${k('xstrue')} {
		flex: 1;
	}
	@media (min-width: 600px) {
		&.${k('smnumorauto')} {
			width: ${({ sm, columns }) => {
				return sm === 'auto' ? 'auto' : `calc(100% * ${sm} / ${columns})`
			}};
		}

		&.${k('smtrue')} {
			flex: 1;
		}
	}

	@media (min-width: 900px) {
		&.${k('mdnumorauto')} {
			width: ${({ md, columns }) => {
				return md === 'auto' ? 'auto' : `calc(100% * ${md} / ${columns})`
			}};
		}
		&.${k('mdtrue')} {
			flex: 1;
		}
	}

	@media (min-width: 1200px) {
		&.${k('lgnumorauto')} {
			width: ${({ lg, columns }) => {
				return lg === 'auto' ? 'auto' : `calc(100% * ${lg} / ${columns})`
			}};
		}
		&.${k('lgtrue')} {
			flex: 1;
		}
	}
	@media (min-width: 1536px) {
		&.${k('xlnumorauto')} {
			width: ${({ xl, columns }) => {
				return xl === 'auto' ? 'auto' : `calc(100% * ${xl} / ${columns})`
			}};
		}
		&.${k('xltrue')} {
			flex: 1;
		}
	}
`

const Grid = forwardRef<HTMLDivElement, GridProps>((p, ref) => {
	const {
		container = false,
		xs = false,
		sm = false,
		md = false,
		lg = false,
		xl = false,
		columnSpacing: columnSpacingProps,
		rowSpacing: rowSpacingProps,
		spacing = 0,
		direction = 'row',
		columns = 12,
		wrap = 'wrap'
	} = p

	const handleSpacing = (
		directionSpacing: BreakPointMapAndOwn<number> | undefined
	) => {
		if (!directionSpacing) {
			if (isNumber(spacing)) {
				return {
					xs: spacing
				}
			} else {
				return {
					xs: 0,
					...spacing
				}
			}
		}

		if (isObject(directionSpacing)) {
			if (isNumber(spacing)) {
				return {
					...directionSpacing,
					xs: isNumber(directionSpacing.xs) ? directionSpacing.xs : spacing
				}
			} else {
				return {
					xs: 0,
					...spacing,
					...directionSpacing
				}
			}
		}

		if (isNumber(directionSpacing)) {
			return {
				xs: directionSpacing
			}
		}
	}

	const columnSpacing = useMemo(() => {
		return handleSpacing(columnSpacingProps)
	}, [columnSpacingProps, spacing])
	const rowSpacing = useMemo(() => {
		return handleSpacing(rowSpacingProps)
	}, [rowSpacingProps, spacing])

	const isBreakPointItem = (value: BreakPointItem, tag: string) => {
		return (
			((isNumber(value) || value === 'auto') && `${tag}numorauto`) ||
			(isBoolean(value) && value && `${tag}true`) ||
			''
		)
	}

	return container
		? withNativeElementProps(
				p,
				<GridContainerRoot
					columnSpacing={columnSpacing}
					rowSpacing={rowSpacing}
					wrap={wrap}
					className={cx(!false && k('notDisableSpacing'))}
					ref={ref}
					direction={direction}
				/>
			)
		: withNativeElementProps(
				p,
				<GridItemRoot
					xs={xs}
					sm={sm}
					md={md}
					lg={lg}
					xl={xl}
					className={cx(
						k(isBreakPointItem(xs, 'xs')),
						k(isBreakPointItem(sm, 'sm')),
						k(isBreakPointItem(md, 'md')),
						k(isBreakPointItem(lg, 'lg')),
						k(isBreakPointItem(xl, 'xl')),
						isNumber(rowSpacing.sm) && k('smRowSpacing'),
						isNumber(rowSpacing.md) && k('mdRowSpacing'),
						isNumber(rowSpacing.lg) && k('lgRowSpacing'),
						isNumber(rowSpacing.xl) && k('xlRowSpacing'),
						isNumber(columnSpacing.sm) && k('smColumnSpacing'),
						isNumber(columnSpacing.md) && k('mdColumnSpacing'),
						isNumber(columnSpacing.lg) && k('lgColumnSpacing'),
						isNumber(columnSpacing.xl) && k('xlColumnSpacing')
					)}
					ref={ref}
					columns={columns}
				/>
			)
})

export default Grid
