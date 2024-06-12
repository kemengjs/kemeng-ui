import { cx, styled } from '@linaria/atomic'
import { getK } from '../../utils/style'
import { forwardRef } from 'react'
import {
	NativeJSXElementsWithoutRef,
	withNativeElementProps
} from '../../utils/nativeProps'
import { themeVariables } from '../../utils'
import { DialogTitleRoot } from '../DialogTitle'

const k = getK('DialogContent')

const DialogContentRoot = styled.div`
	flex: 1 1 auto;
	-webkit-overflow-scrolling: touch;
	overflow-y: auto;
	padding: 20px 24px;
	&.${k('dividers')} {
		padding: 16px 24px;
		border-top: 1px solid ${themeVariables.divider};
		border-bottom: 1px solid ${themeVariables.divider};
	}
	&.${k('notDividers')} {
		${DialogTitleRoot} + & {
			padding-top: 0;
		}
	}
`

export type DialogContentProps = {
	dividers?: boolean
} & NativeJSXElementsWithoutRef<'div'>

const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
	(p, ref) => {
		const { dividers = false } = p

		return withNativeElementProps(
			p,
			<DialogContentRoot
				className={cx(dividers ? k('dividers') : k('notDividers'))}
				ref={ref}
			/>
		)
	}
)

export default DialogContent
