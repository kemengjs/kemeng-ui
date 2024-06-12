import { styled } from '@linaria/atomic'
import { forwardRef, useContext } from 'react'
import {
	NativeJSXElementsWithoutRef,
	withNativeElementProps
} from '../../utils/nativeProps'
import Typography from '../Typography'
import DialogContext from '../Dialog/DialogContext'

export const DialogTitleRoot = styled(Typography)`
	padding: 16px 24px;
	flex: 0 0 auto;
`

export type DialogTitleProps = NativeJSXElementsWithoutRef<'h2'>

const DialogTitle = forwardRef<HTMLDivElement, DialogTitleProps>((p, ref) => {
	const { id: idProp } = p

	const { titleId = idProp } = useContext(DialogContext)

	return withNativeElementProps(
		p,
		<DialogTitleRoot as={'h2'} variant='h6' id={idProp ?? titleId} ref={ref} />
	)
})

export default DialogTitle
