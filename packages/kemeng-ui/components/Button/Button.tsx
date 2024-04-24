import {
	ButtonHTMLAttributes,
	DetailedHTMLProps,
	MouseEventHandler,
	ReactNode,
	forwardRef,
	useImperativeHandle,
	useRef,
	useState
} from 'react'
import { NativeProps, withNativeProps } from '../../utils/nativeProps'
import { mergeProps } from '../../utils/withDefaultProps'
import { isPromise } from '../../utils/validate'
import { styled } from '@linaria/atomic'
import { BaseColorType, themeVariables } from '../../utils'

export type ButtonRef = {
	nativeElement: HTMLButtonElement | null
}

type NativeButtonProps = DetailedHTMLProps<
	ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>

export type ButtonProps = {
	color?: BaseColorType
	variant?: 'contained' | 'outline' | 'text'
	size?: 'mini' | 'small' | 'middle' | 'large'
	block?: boolean
	loading?: boolean | 'auto'
	loadingText?: string
	loadingIcon?: ReactNode
	disabled?: boolean
	onClick?: (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => void | Promise<void> | unknown
	type?: 'submit' | 'reset' | 'button'
	shape?: 'default' | 'rounded' | 'rectangular'
	children?: ReactNode
} & Pick<
	NativeButtonProps,
	'onMouseDown' | 'onMouseUp' | 'onTouchStart' | 'onTouchEnd' | 'id'
> &
	NativeProps

const defaultProps: ButtonProps = {
	color: 'primary',
	variant: 'contained',
	block: false,
	loading: false,
	loadingIcon: '123',
	type: 'button',
	shape: 'default',
	size: 'middle'
}

const Button = styled.button<ButtonProps>`
	display: inline-flex;
	-webkit-box-align: center;
	align-items: center;
	-webkit-box-pack: center;
	justify-content: center;
	position: relative;
	box-sizing: border-box;
	-webkit-tap-highlight-color: transparent;
	outline: 0px;
	border: 0px;
	cursor: pointer;
	user-select: none;
	vertical-align: middle;
	appearance: none;
	text-decoration: none;
	font-weight: 500;
	font-size: 0.875rem;
	line-height: 1.75;
	letter-spacing: 0.02857em;
	text-transform: uppercase;
	min-width: 64px;
	padding: 6px 16px;
	border-radius: 4px;
	transition:
		background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
		box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
		border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
		color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
	color: ${({ color }) => themeVariables[color].contrastText};
	background-color: ${themeVariables.primary.main};
	box-shadow:
		rgba(0, 0, 0, 0.2) 0px 3px 1px -2px,
		rgba(0, 0, 0, 0.14) 0px 2px 2px 0px,
		rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
	&:hover {
		background-color: ${themeVariables.primary.dark};
		box-shadow:
			rgba(0, 0, 0, 0.2) 0px 2px 4px -1px,
			rgba(0, 0, 0, 0.14) 0px 4px 5px 0px,
			rgba(0, 0, 0, 0.12) 0px 1px 10px 0px;
	}
`

const KeMengButton = forwardRef<ButtonRef, ButtonProps>((p, ref) => {
	const props = mergeProps(defaultProps, p)
	const [innerLoading, setInnerLoading] = useState(false)
	const nativeButtonRef = useRef<HTMLButtonElement>(null)
	const loading = props.loading === 'auto' ? innerLoading : props.loading
	const disabled = props.disabled || loading

	useImperativeHandle(ref, () => ({
		get nativeElement() {
			return nativeButtonRef.current
		}
	}))

	const handleClick: MouseEventHandler<HTMLButtonElement> = async e => {
		if (!props.onClick) return

		const promise = props.onClick(e)

		if (isPromise(promise)) {
			try {
				setInnerLoading(true)
				await promise
				setInnerLoading(false)
			} catch (e) {
				setInnerLoading(false)
				throw e
			}
		}
	}

	console.log('props', props)

	return withNativeProps(
		props,
		<Button
			ref={nativeButtonRef}
			type={props.type}
			onClick={handleClick}
			// className={classNames(
			// 	classPrefix,
			// 	{
			// 		[`${classPrefix}-${props.color}`]: props.color,
			// 		[`${classPrefix}-block`]: props.block,
			// 		[`${classPrefix}-disabled`]: disabled,
			// 		[`${classPrefix}-variant-outline`]: props.variant === 'outline',
			// 		[`${classPrefix}-variant-none`]: props.variant === 'none',
			// 		[`${classPrefix}-mini`]: props.size === 'mini',
			// 		[`${classPrefix}-small`]: props.size === 'small',
			// 		[`${classPrefix}-large`]: props.size === 'large',
			// 		[`${classPrefix}-loading`]: loading
			// 	},
			// 	`${classPrefix}-shape-${props.shape}`
			// )}
			disabled={disabled}
			onMouseDown={props.onMouseDown}
			onMouseUp={props.onMouseUp}
			onTouchStart={props.onTouchStart}
			onTouchEnd={props.onTouchEnd}
			color={props.color}
		>
			{/* {loading ? (
				<div className={`-loading-wrapper`}>
					{props.loadingIcon}
					{props.loadingText}
				</div>
			) : (
				<span>{props.children}</span>
			)} */}
			{props.children}
			<span>{}</span>
		</Button>
	)
})

export default KeMengButton
