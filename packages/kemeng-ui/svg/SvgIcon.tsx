import { cx, styled } from '@linaria/atomic'
import { BaseColorType, themeVariables } from '../utils'
import { ReactNode, forwardRef, isValidElement } from 'react'
import { NativeJSXElementsWithoutRef } from '../utils/nativeProps'
import { useTheme } from '../components/ThemePrivder/themeContext'
import { getTransitionNum } from '../components/ThemePrivder/createTransition'

type SvgIconRootProps = {
	baseColor?: SvgIconProps['color']
	hasSvgAsChild?: boolean
	transitionCss: Record<string, string>
	fontSize?: SvgIconProps['fontSize']
}

const SvgIconRoot = styled.svg<SvgIconRootProps>`
	user-select: none;
	width: 1em;
	height: 1em;
	display: inline-block;

	fill: ${({ hasSvgAsChild }) => {
		return hasSvgAsChild ? 'none' : 'currentColor'
	}};

	flex-shrink: 0;
	transition: ${({ transitionCss }) => transitionCss.fill};
	font-size: ${({ fontSize }) =>
		({
			inherit: 'inherit',
			small: '1.25rem',
			medium: '1.5rem',
			large: '2.1875rem'
		})[fontSize]};
	color: ${({ baseColor }) =>
		themeVariables[baseColor]?.main ||
		{
			action: themeVariables.action.active,
			disabled: themeVariables.action.disabled,
			inherit: 'inherit'
		}[baseColor]};
`

export type SvgIconProps = {
	color?: BaseColorType | 'inherit' | 'action' | 'disabled'
	fontSize?: 'inherit' | 'large' | 'medium' | 'small'
	htmlColor?: string
	inheritViewBox?: boolean
	shapeRendering?: string
	titleAccess?: string
	viewBox?: string
	/**
	 * Allows you to redefine what the coordinates without units mean inside an SVG element.
	 * For example, if the SVG element is 500 (width) by 200 (height),
	 * and you pass viewBox="0 0 50 20",
	 * this means that the coordinates inside the SVG will go from the top left corner (0,0)
	 * to bottom right (50,20) and each unit will be worth 10px.
	 * @default '0 0 24 24'
	 */
} & NativeJSXElementsWithoutRef<'svg'>

const SvgIcon = forwardRef<SVGSVGElement, SvgIconProps>(
	function SvgIcon(p, ref) {
		const {
			children,
			className,
			color = 'inherit',
			fontSize = 'medium',
			htmlColor,
			inheritViewBox = false,
			titleAccess,
			viewBox = '0 0 24 24',
			...other
		} = p

		const hasSvgAsChild = isValidElement(children) && children.type === 'svg'

		const more: {
			viewBox?: string
		} = {}

		if (!inheritViewBox) {
			more.viewBox = viewBox
		}

		const { createTransition, theme } = useTheme()
		const transitionCss = {
			fill: createTransition('fill', {
				duration: getTransitionNum(theme.transition.shorter)
			})
		}

		console.log('more', more)

		return (
			<SvgIconRoot
				className={cx(className)}
				focusable='false'
				color={htmlColor}
				fontSize={fontSize}
				transitionCss={transitionCss}
				baseColor={color}
				aria-hidden={titleAccess ? undefined : true}
				role={titleAccess ? 'img' : undefined}
				hasSvgAsChild={hasSvgAsChild}
				ref={ref}
				{...more}
				{...other}
				{...(hasSvgAsChild && (children.props as Object))}
			>
				{hasSvgAsChild
					? (children.props as { children: ReactNode }).children
					: children}
				{titleAccess ? <title>{titleAccess}</title> : null}
			</SvgIconRoot>
		)
	}
)

export default SvgIcon
