import {
	AnchorHTMLAttributes,
	DetailedHTMLProps,
	ReactNode,
	forwardRef
} from 'react'
import Typography, { TypographyProps } from '../Typography'
import { cx, styled } from '@linaria/atomic'
import { getK } from '../../utils/style'
import { themeVariables } from '../../utils'

export type LinkProps = {
	variant?: TypographyProps['variant']
	underline?: 'none' | 'hover' | 'always'
	children?: ReactNode
} & NativeButtonProps

type NativeButtonProps = DetailedHTMLProps<
	AnchorHTMLAttributes<HTMLAnchorElement>,
	HTMLAnchorElement
>

const k = getK('link')

const LinkRoot = styled(Typography)<LinkProps>`
	color: ${themeVariables.primary.main};
	text-decoration-color: ${themeVariables.primary.main};
	cursor: pointer;
	&.${k('none')} {
		text-decoration: none;
	}
	&.${k('hover')} {
		text-decoration: none;
		&:hover {
			text-decoration: underline;
		}
	}
	&.${k('always')} {
		text-decoration: underline;
		&:hover {
			text-decoration-color: ${themeVariables.primary.dark};
		}
	}
`

const Link = forwardRef<HTMLAnchorElement, LinkProps>((p, ref) => {
	const { children, underline = 'always', variant = 'body1', ...other } = p

	return (
		<LinkRoot
			as='a'
			variant={variant}
			underline={underline}
			ref={ref}
			className={cx(
				underline === 'always'
					? k('always')
					: underline === 'hover'
						? k('hover')
						: k('none')
			)}
			{...other}
		>
			{children}
		</LinkRoot>
	)
})

export default Link
