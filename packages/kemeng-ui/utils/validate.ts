export function isObject<T = Record<any, any>>(val: unknown): val is T {
	return val !== null && typeof val === 'object'
}

export function isPromise(obj: unknown): obj is Promise<unknown> {
	return (
		!!obj && typeof obj === 'object' && typeof (obj as any).then === 'function'
	)
}

export function isDate(val: unknown): val is Date {
	return (
		Object.prototype.toString.call(val) === '[object Date]' &&
		!Number.isNaN((val as Date).getTime())
	)
}

export function isMobileNumber(value: string): boolean {
	value = value.replace(/[^-|\d]/g, '')
	return (
		/^((\+86)|(86))?(1)\d{10}$/.test(value) || /^0[0-9-]{10,13}$/.test(value)
	)
}
