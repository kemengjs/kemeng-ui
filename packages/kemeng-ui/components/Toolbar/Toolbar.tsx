import { forwardRef } from 'react'
import { getK, unit } from '../../utils/style'
import { cx, styled } from '@linaria/atomic'
import {
	NativeJSXElementsWithoutRef,
	withNativeElementProps
} from '../../utils/nativeProps'

const k = getK('Toolbar')

const ToolbarRoot = styled.div`
	position: relative;
	display: flex;
	align-items: center;

	min-height: 56px;

	&.${k('gutters')} {
		padding-left: ${unit(2)};
		padding-right: ${unit(2)};

		@media (min-width: 600px) {
			padding-left: ${unit(3)};
			padding-right: ${unit(3)};
			min-height: 64px;
		}

		@media (min-width: 0px) {
			@media (orientation: landscape) {
				min-height: 48px;
			}
		}
	}

	&.${k('dense')} {
		min-height: 48px;
	}
`

export type ToolbarProps = {
	disableGutters?: boolean
	variant?: 'regular' | 'dense'
} & NativeJSXElementsWithoutRef<'div'>

const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>((p, ref) => {
	const { disableGutters = false, variant = 'regular' } = p

	return withNativeElementProps(
		p,
		<ToolbarRoot
			ref={ref}
			className={cx(
				!disableGutters && k('gutters'),
				variant === 'dense' && k('dense')
			)}
		/>
	)
})

export default Toolbar
