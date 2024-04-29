import { styled } from '@linaria/atomic'
import { forwardRef } from 'react'

export type PaperProps = {}

const PaperRoot = styled.div``

const Paper = forwardRef(() => {
	return <PaperRoot></PaperRoot>
})

export default Paper
