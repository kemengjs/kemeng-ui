import { isValidElement } from 'react'

export default function isKemenguiElement(
	element: any,
	muiNames: readonly string[]
): boolean {
	return (
		isValidElement(element) &&
		muiNames.indexOf(
			// For server components `muiName` is avaialble in element.type._payload.value.muiName
			// relevant info - https://github.com/facebook/react/blob/2807d781a08db8e9873687fccc25c0f12b4fb3d4/packages/react/src/ReactLazy.js#L45
			// eslint-disable-next-line no-underscore-dangle
			(element.type as any).muiName ??
				(element.type as any)?._payload?.value?.muiName
		) !== -1
	)
}
