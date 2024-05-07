import { ReactNode, Ref, forwardRef, memo } from 'react'
import SvgIcon, { SvgIconProps } from './SvgIcon'

/**
 * Private module reserved for @mui packages.
 */
export default function createSvgIcon(
	path: ReactNode,
	displayName: string
): typeof SvgIcon {
	console.log('sss')

	function Component(props: SvgIconProps, ref: Ref<SVGSVGElement>) {
		return (
			<SvgIcon data-testid={`${displayName}Icon`} ref={ref} {...props}>
				{path}
			</SvgIcon>
		)
	}

	return memo(forwardRef(Component))
}
