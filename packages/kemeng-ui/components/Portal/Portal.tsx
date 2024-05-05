import {
	ReactNode,
	cloneElement,
	forwardRef,
	isValidElement,
	useState
} from 'react'
import useEnhancedEffect from '../../hooks/useEnhancedEffect'
import setRef from '../../utils/ref'
import { useForkRef } from '../../hooks/useForkRef'
import { createPortal } from 'react-dom'

function getContainer(container: PortalProps['container']) {
	return typeof container === 'function' ? container() : container
}

export type PortalProps = {
	children?: ReactNode
	container?: Element | (() => Element | null) | null
	disablePortal?: boolean
}

const Portal = forwardRef<Element, PortalProps>((p, ref) => {
	const { children, container, disablePortal = false } = p
	const [mountNode, setMountNode] =
		useState<ReturnType<typeof getContainer>>(null)

	const handleRef = useForkRef(
		// @ts-ignore
		isValidElement(children) ? children.ref : null,
		ref
	)

	useEnhancedEffect(() => {
		if (!disablePortal) {
			setMountNode(getContainer(container) || document.body)
		}
	}, [container, disablePortal])

	useEnhancedEffect(() => {
		if (mountNode && !disablePortal) {
			setRef(ref, mountNode)
			return () => {
				setRef(ref, null)
			}
		}

		return undefined
	}, [ref, mountNode, disablePortal])

	if (disablePortal) {
		if (isValidElement(children)) {
			const newProps = {
				ref: handleRef
			}
			return cloneElement(children, newProps)
		}
		return <>{children}</>
	}

	return <>{mountNode ? createPortal(children, mountNode) : mountNode}</>
})

export default Portal
