export type EventHandlers = Record<string, React.EventHandler<any>>

export function extractEventHandlers(
	object: Record<string, any> | undefined,
	excludeKeys: string[] = []
): EventHandlers {
	if (object === undefined) {
		return {}
	}

	const result: EventHandlers = {}

	Object.keys(object)
		.filter(
			prop =>
				prop.match(/^on[A-Z]/) &&
				typeof object[prop] === 'function' &&
				!excludeKeys.includes(prop)
		)
		.forEach(prop => {
			result[prop] = object[prop]
		})

	return result
}
