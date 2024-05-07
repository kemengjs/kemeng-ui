import { cx, styled } from '@linaria/atomic'
import { getK } from '../../utils/style'
import { NativeJSXElementsWithoutRef } from '../../utils/nativeProps'
import { useTheme } from '../ThemePrivder'

const NotchedOutlineRoot = styled.fieldset`
	text-align: left;
	position: absolute;
	bottom: 0;
	right: 0;
	top: -5px;
	left: 0;
	margin: 0;
	padding: 0 8px;
	pointer-events: none;
	border-radius: inherit;
	border-style: solid;
	border-width: 1px;
	overflow: hidden;
	min-width: 0%;
`

const k = getK('NotchedOutline')

type NotchedOutlineLegendProps = {
	transitionCss: Record<string, string>
}

const NotchedOutlineLegend = styled.legend<NotchedOutlineLegendProps>`
	float: unset;
	width: auto;
	overflow: hidden;

	&.${k('notWithLabel')} {
		padding: 0;
		line-height: 11px;
		transition: ${({ transitionCss }) => {
			return transitionCss.width
		}};
	}

	&.${k('withLabel')} {
		display: block;
		padding: 0;
		height: 11px;
		font-size: 0.75em;
		visibility: hidden;
		max-width: 0.01;
		transition: ${({ transitionCss }) => {
			return transitionCss['max-width-50']
		}};

		white-space: nowrap;
		& > span {
			padding-left: 5px;
			padding-right: 5px;
			display: inline-block;
			opacity: 0;
			visibility: visible;
		}
		&.${k('notched')} {
			max-width: 100%;
			transition: ${({ transitionCss }) => {
				return transitionCss['max-width-100']
			}};
		}
	}
`

export type NotchedOutlineProps = {
	disabled?: boolean
	error?: boolean
	focused?: boolean
	label?: React.ReactNode
	notched: boolean
} & NativeJSXElementsWithoutRef<'fieldset'>

export default function NotchedOutline(props: NotchedOutlineProps) {
	const { children, className, label, notched, ...other } = props
	const withLabel = label != null && label !== ''

	const { createTransition, theme } = useTheme()

	const transitionCss = {
		width: createTransition('width', {
			duration: 150,
			easing: theme.transition.easeOut
		}),

		'max-width-50': createTransition('max-width', {
			duration: 50,
			easing: theme.transition.easeOut
		}),
		'max-width-100': createTransition('max-width', {
			duration: 100,
			easing: theme.transition.easeOut,
			delay: 50
		})
	}

	return (
		<NotchedOutlineRoot aria-hidden className={className} {...other}>
			<NotchedOutlineLegend
				transitionCss={transitionCss}
				className={cx(
					withLabel ? k('withLabel') : k('notWithLabel'),
					notched && k('notched')
				)}
			>
				{/* Use the nominal use case of the legend, avoid rendering artefacts. */}
				{withLabel ? (
					<span>{label}</span>
				) : (
					// notranslate needed while Google Translate will not fix zero-width space issue
					<span className='notranslate'>&#8203;</span>
				)}
			</NotchedOutlineLegend>
		</NotchedOutlineRoot>
	)
}
