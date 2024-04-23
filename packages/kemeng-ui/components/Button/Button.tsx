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

export type ButtonRef = {
	nativeElement: HTMLButtonElement | null
}

type NativeButtonProps = DetailedHTMLProps<
	ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>

export type ButtonProps = {
	color?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
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
	color: 'default',
	variant: 'contained',
	block: false,
	loading: false,
	loadingIcon: '123',
	type: 'button',
	shape: 'default',
	size: 'middle'
}

const Button = styled.button<{ isActive: boolean }>`
	color: ${({ isActive }) => {
		return !isActive ? 'red' : 'green'
	}};
	font-size: 16px;
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

	return withNativeProps(
		props,
		<Button
			isActive={true}
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
		>
			{loading ? (
				<div className={`-loading-wrapper`}>
					{props.loadingIcon}
					{props.loadingText}
				</div>
			) : (
				<span>{props.children}</span>
			)}
		</Button>
	)
})

export default KeMengButton
