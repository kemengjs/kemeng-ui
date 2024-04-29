import { ReactNode, forwardRef } from 'react'
import { BaseColorType } from '../../utils'

export type AppBarProps = {
	color?: BaseColorType
	children?: ReactNode
}

const AppBar = forwardRef<HTMLDivElement, AppBarProps>((p, ref) => {
	const {} = p

	return <div></div>
})
