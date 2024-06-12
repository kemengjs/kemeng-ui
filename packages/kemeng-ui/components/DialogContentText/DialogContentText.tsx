import { styled } from '@linaria/atomic'

import { forwardRef } from 'react'
import {
	NativeJSXElementsWithoutRef,
	withNativeElementProps
} from '../../utils/nativeProps'
import Typography from '../Typography'
import { themeVariables } from '../../utils'

const DialogContentTextRoot = styled(Typography)`
	outline: 0;
`

export type DialogContentTextProps = NativeJSXElementsWithoutRef<'p'>

const DialogContentText = forwardRef<HTMLDivElement, DialogContentTextProps>(
	(p, ref) => {
		return withNativeElementProps(
			p,
			<DialogContentTextRoot
				as={'p'}
				variant='body1'
				style={{
					color: themeVariables.text.secondary
				}}
				ref={ref}
			/>
		)
	}
)

export default DialogContentText
