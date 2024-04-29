import { cx, styled } from '@linaria/atomic'
import { ElementType, ReactNode, forwardRef } from 'react'
import { NativeElementProps, withNativeProps } from '../../utils/nativeProps'
import { TypographyType, themeVariables } from '../../utils'
import { capitalizeFirstLetter } from '../../utils/str'
import { getK } from '../../utils/style'

const defaultVariantMapping: VariantMapping = {
	h1: 'h1',
	h2: 'h2',
	h3: 'h3',
	h4: 'h4',
	h5: 'h5',
	h6: 'h6',
	subtitle1: 'h6',
	subtitle2: 'h6',
	body1: 'p',
	body2: 'p',
	inherit: 'p'
}

export type VariantMapping = {
	h1: ElementType
	h2: ElementType
	h3: ElementType
	h4: ElementType
	h5: ElementType
	h6: ElementType
	subtitle1: ElementType
	subtitle2: ElementType
	body1: ElementType
	body2: ElementType
	inherit: ElementType
}
export type Variant = keyof VariantMapping

const k = getK('typography')

const getTypographyObj = (variant: Variant) => {
	return themeVariables[
		`typography${capitalizeFirstLetter(variant)}`
	] as TypographyType
}

const TypographyRoot = styled.span<TypographyProps>`
	margin: 0;
	font-family: ${({ variant }) => getTypographyObj(variant).fontFamily};
	font-weight: ${({ variant }) => getTypographyObj(variant).fontWeight};
	font-size: ${({ variant }) => getTypographyObj(variant).fontSize};
	line-height: ${({ variant }) => getTypographyObj(variant).lineHeight};
	letter-spacing: ${({ variant }) => getTypographyObj(variant).letterSpacing};
	text-align: ${({ align }) => align};

	&.${k('noWrap')} {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&.${k('gutterBottom')} {
		margin-bottom: 0.35em;
	}
	&.${k('paragraph')} {
		margin-bottom: 16px;
	}
`

export type TypographyProps = {
	align?: 'inherit' | 'left' | 'center' | 'right' | 'justify'
	children?: ReactNode
	gutterBottom?: boolean
	noWrap?: boolean
	paragraph?: boolean
	variant?: Variant
	component?: ElementType
	variantMapping?: VariantMapping
} & NativeElementProps

const Typography = forwardRef<HTMLElement, TypographyProps>((p, ref) => {
	const {
		align = 'inherit',
		component,
		gutterBottom = false,
		noWrap = false,
		paragraph = false,
		variant = 'body1',
		variantMapping = defaultVariantMapping,
		children,
		onClick,
		...other
	} = p

	const Component: ElementType =
		component ||
		(paragraph
			? 'p'
			: variantMapping[variant] || defaultVariantMapping[variant]) ||
		'span'

	return withNativeProps(
		p,
		<TypographyRoot
			ref={ref}
			align={align}
			gutterBottom={gutterBottom}
			noWrap={noWrap}
			variant={variant}
			className={cx(
				noWrap && k('noWrap'),
				paragraph && k('paragraph'),
				gutterBottom && k('gutterBottom')
			)}
			as={Component}
			{...other}
		>
			{children}
		</TypographyRoot>
	)
})

export default Typography
