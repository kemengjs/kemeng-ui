import { EffectCallback, useEffect } from 'react'

const EMPTY = [] as unknown[]

/**
 * 挂载后执行一次
 */
export default function useOnMount(fn: EffectCallback) {
	useEffect(fn, EMPTY)
}
