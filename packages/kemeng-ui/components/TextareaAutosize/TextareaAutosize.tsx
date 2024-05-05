import {
	CSSProperties,
	ChangeEvent,
	ForwardedRef,
	Ref,
	forwardRef,
	useCallback,
	useRef
} from 'react'
import { useForkRef } from '../../hooks/useForkRef'
import ownerWindow from '../../utils/ownerDocument'
import useEnhancedEffect from '../../hooks/useEnhancedEffect'
import { debounce } from '../../utils/debounce'

function getStyleValue(value: string) {
	return parseInt(value, 10) || 0
}

const styles: {
	shadow: CSSProperties
} = {
	shadow: {
		// Visibility needed to hide the extra text area on iPads
		visibility: 'hidden',
		// Remove from the content flow
		position: 'absolute',
		// Ignore the scrollbar width
		overflow: 'hidden',
		height: 0,
		top: 0,
		left: 0,
		// Create a new layer, increase the isolation of the computed values
		transform: 'translateZ(0)'
	}
}

type TextareaStyles = {
	outerHeightStyle: number
	overflowing: boolean
}

function isEmpty(obj: TextareaStyles) {
	return (
		obj === undefined ||
		obj === null ||
		Object.keys(obj).length === 0 ||
		(obj.outerHeightStyle === 0 && !obj.overflowing)
	)
}

export interface TextareaAutosizeProps
	extends Omit<
		React.TextareaHTMLAttributes<HTMLTextAreaElement>,
		'children' | 'rows'
	> {
	ref?: Ref<HTMLTextAreaElement>
	/**
	 * Maximum number of rows to display.
	 */
	maxRows?: string | number
	/**
	 * Minimum number of rows to display.
	 * @default 1
	 */
	minRows?: string | number
}

const TextareaAutosize = forwardRef(function TextareaAutosize(
	props: TextareaAutosizeProps,
	forwardedRef: ForwardedRef<Element>
) {
	const { onChange, maxRows, minRows = 1, style, value, ...other } = props

	const { current: isControlled } = useRef(value != null)
	const inputRef = useRef<HTMLTextAreaElement>(null)
	const handleRef = useForkRef(forwardedRef, inputRef)
	const heightRef = useRef<number | null>(null)
	const shadowRef = useRef<HTMLTextAreaElement>(null)

	const calculateTextareaStyles = useCallback(() => {
		const input = inputRef.current!

		const containerWindow = ownerWindow(input)
		const computedStyle = containerWindow.getComputedStyle(input)

		// If input's width is shrunk and it's not visible, don't sync height.
		if (computedStyle.width === '0px') {
			return {
				outerHeightStyle: 0,
				overflowing: false
			}
		}

		const inputShallow = shadowRef.current!

		inputShallow.style.width = computedStyle.width
		inputShallow.value = input.value || props.placeholder || 'x'
		if (inputShallow.value.slice(-1) === '\n') {
			// Certain fonts which overflow the line height will cause the textarea
			// to report a different scrollHeight depending on whether the last line
			// is empty. Make it non-empty to avoid this issue.
			inputShallow.value += ' '
		}

		const boxSizing = computedStyle.boxSizing
		const padding =
			getStyleValue(computedStyle.paddingBottom) +
			getStyleValue(computedStyle.paddingTop)
		const border =
			getStyleValue(computedStyle.borderBottomWidth) +
			getStyleValue(computedStyle.borderTopWidth)

		// The height of the inner content
		const innerHeight = inputShallow.scrollHeight

		// Measure height of a textarea with a single row
		inputShallow.value = 'x'
		const singleRowHeight = inputShallow.scrollHeight

		// The height of the outer content
		let outerHeight = innerHeight

		if (minRows) {
			outerHeight = Math.max(Number(minRows) * singleRowHeight, outerHeight)
		}
		if (maxRows) {
			outerHeight = Math.min(Number(maxRows) * singleRowHeight, outerHeight)
		}
		outerHeight = Math.max(outerHeight, singleRowHeight)

		// Take the box sizing into account for applying this value as a style.
		const outerHeightStyle =
			outerHeight + (boxSizing === 'border-box' ? padding + border : 0)
		const overflowing = Math.abs(outerHeight - innerHeight) <= 1

		return { outerHeightStyle, overflowing }
	}, [maxRows, minRows, props.placeholder])

	const syncHeight = useCallback(() => {
		const textareaStyles = calculateTextareaStyles()

		if (isEmpty(textareaStyles)) {
			return
		}

		const outerHeightStyle = textareaStyles.outerHeightStyle
		const input = inputRef.current!
		if (heightRef.current !== outerHeightStyle) {
			heightRef.current = outerHeightStyle
			input.style.height = `${outerHeightStyle}px`
		}
		input.style.overflow = textareaStyles.overflowing ? 'hidden' : ''
	}, [calculateTextareaStyles])

	useEnhancedEffect(() => {
		const handleResize = () => {
			syncHeight()
		}
		// Workaround a "ResizeObserver loop completed with undelivered notifications" error
		// in test.
		// Note that we might need to use this logic in production per https://github.com/WICG/resize-observer/issues/38
		// Also see https://github.com/mui/mui-x/issues/8733
		let rAF: any
		const rAFHandleResize = () => {
			cancelAnimationFrame(rAF)
			rAF = requestAnimationFrame(() => {
				handleResize()
			})
		}
		const debounceHandleResize = debounce(handleResize)
		const input = inputRef.current!
		const containerWindow = ownerWindow(input)

		containerWindow.addEventListener('resize', debounceHandleResize)

		let resizeObserver: ResizeObserver

		if (typeof ResizeObserver !== 'undefined') {
			resizeObserver = new ResizeObserver(
				process.env.NODE_ENV === 'test' ? rAFHandleResize : handleResize
			)
			resizeObserver.observe(input)
		}

		return () => {
			debounceHandleResize.clear()
			cancelAnimationFrame(rAF)
			containerWindow.removeEventListener('resize', debounceHandleResize)
			if (resizeObserver) {
				resizeObserver.disconnect()
			}
		}
	}, [calculateTextareaStyles, syncHeight])

	useEnhancedEffect(() => {
		syncHeight()
	})

	const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		if (!isControlled) {
			syncHeight()
		}

		if (onChange) {
			onChange(event)
		}
	}

	return (
		<>
			<textarea
				value={value}
				onChange={handleChange}
				ref={handleRef}
				// Apply the rows prop to get a "correct" first SSR paint
				rows={minRows as number}
				style={style}
				{...other}
			/>
			<textarea
				aria-hidden
				className={props.className}
				readOnly
				ref={shadowRef}
				tabIndex={-1}
				style={{
					...styles.shadow,
					...style,
					paddingTop: 0,
					paddingBottom: 0
				}}
			/>
		</>
	)
})

export default TextareaAutosize
