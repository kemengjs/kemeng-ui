import { isObject } from './validate'

export function assignObj<A>(
	objSrc: Record<any, any>,
	objTar: Record<any, any>
): A {
	const ret = { ...objSrc, ...objTar }
	for (const [key, value] of Object.entries(objSrc)) {
		if (isObject(value) && isObject(objTar[key])) {
			ret[key] = { ...value, ...objTar[key] }
		}
	}

	return ret as A
}
