import { MutableRefObject } from 'react'

/**
 * @param ref A ref callback or ref object. If anything falsy, this is a no-op.
 */
export default function setRef<T>(
	ref:
		| MutableRefObject<T | null>
		| ((instance: T | null) => void)
		| null
		| undefined,
	value: T | null
): void {
	if (typeof ref === 'function') {
		ref(value)
	} else if (ref) {
		ref.current = value
	}
}
