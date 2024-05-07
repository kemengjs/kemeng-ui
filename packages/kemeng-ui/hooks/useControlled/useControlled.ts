import { useCallback, useRef, useState } from 'react'

export interface UseControlledProps<T = unknown> {
	/**
	 * Holds the component value when it's controlled.
	 */
	controlled: T | undefined
	/**
	 * The default value when uncontrolled.
	 */
	default: T | undefined
}

export default function useControlled<T = unknown>({
	controlled,
	default: defaultProp
}: UseControlledProps<T>): [T, (newValue: T | ((prevValue: T) => T)) => void] {
	// isControlled is ignored in the hook dependency lists as it should never change.
	const { current: isControlled } = useRef(controlled !== undefined)
	const [valueState, setValue] = useState(defaultProp)
	const value = isControlled ? controlled : valueState

	const setValueIfUncontrolled = useCallback(newValue => {
		if (!isControlled) {
			setValue(newValue)
		}
	}, [])

	return [value, setValueIfUncontrolled]
}
