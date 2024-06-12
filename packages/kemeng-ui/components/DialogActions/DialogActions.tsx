import { cx, styled } from '@linaria/atomic'
import { getK } from '../../utils/style'
import { forwardRef } from 'react'
import {
	NativeJSXElementsWithoutRef,
	withNativeElementProps
} from '../../utils/nativeProps'

const k = getK('DialogActions')

const DialogActionsRoot = styled.div`
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

export type DialogActionsProps = {
	disableSpacing?: boolean
} & NativeJSXElementsWithoutRef<'div'>

const DialogActions = forwardRef<HTMLDivElement, DialogActionsProps>(
	(p, ref) => {
		const { disableSpacing = false } = p

		return withNativeElementProps(
			p,
			<DialogActionsRoot
				className={cx(!disableSpacing && k('notDisableSpacing'))}
				ref={ref}
			/>
		)
	}
)

export default DialogActions
