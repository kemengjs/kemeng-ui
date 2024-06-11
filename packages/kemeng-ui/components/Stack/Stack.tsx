import { cx, styled } from '@linaria/atomic'
import {
	Children,
	ReactElement,
	ReactNode,
	cloneElement,
	forwardRef
} from 'react'
import {
	NativeJSXElementsWithoutRef,
	withNativeElementProps
} from '../../utils/nativeProps'
import { getK, unit } from '../../utils/style'

const k = getK('Toolbar')

const StackRoot = styled.div<StackProps>`
	display: flex;
	flex-direction: column;

	&.${k('spacing')} {
		&.${k('useFlexGap')} {
			gap: ${({ spacing }) => {
				return unit(spacing)
			}};
		}
		&.${k('notUseFlexGap')} {
			& > :not(style):not(style) {
				margin: 0;
			}
			& > :not(style) ~ :not(style) {
				${k('row')} > & {
					margin-left: ${({ spacing }) => {
						return unit(spacing)
					}};
				}
				${k('row-reverse')} > & {
					margin-right: ${({ spacing }) => {
						return unit(spacing)
					}};
				}
				${k('column')} > & {
					margin-top: ${({ spacing }) => {
						return unit(spacing)
					}};
				}
				${k('column-reverse')} > & {
					margin-bottom: ${({ spacing }) => {
						return unit(spacing)
					}};
				}
			}
		}
	}
`
export type StackProps = {
	direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
	spacing?: number
	divider?: ReactNode
	useFlexGap?: boolean
} & NativeJSXElementsWithoutRef<'div'>

function joinChildren(children: ReactNode, separator: ReactElement<any>) {
	const childrenArray = Children.toArray(children).filter(Boolean)

	return childrenArray.reduce<ReactNode[]>((output, child, index) => {
		output.push(child)

		if (index < childrenArray.length - 1) {
			output.push(cloneElement(separator, { key: `separator-${index}` }))
		}

		return output
	}, [])
}

const Stack = forwardRef<HTMLDivElement, StackProps>((p, ref) => {
	const {
		direction = 'column',
		spacing = 0,
		divider,
		children,
		useFlexGap = false
	} = p

	return withNativeElementProps(
		p,
		<StackRoot
			className={cx(
				spacing && k('spacing'),
				direction === 'column' && k('column'),
				direction === 'column-reverse' && k('column-reverse'),
				direction === 'row' && k('row'),
				direction === 'row-reverse' && k('row-reverse'),
				useFlexGap ? k('useFlexGap') : k('notUseFlexGap')
			)}
			spacing={spacing}
			ref={ref}
		>
			{divider
				? joinChildren(children, divider as ReactElement<any>)
				: children}
		</StackRoot>
	)
})

export default Stack
