import { useRef } from 'react'

const UNINITIALIZED = {}

/**
 * 初始化只会执行一次 防止重复加载  惰性初始化
 *
 * @usage
 *   const ref = useLazyRef(sortColumns, columns)
 */
export default function useLazyRef<T, U>(init: (arg?: U) => T, initArg?: U) {
	const ref = useRef(UNINITIALIZED as unknown as T)

	if (ref.current === UNINITIALIZED) {
		ref.current = init(initArg)
	}

	return ref
}
