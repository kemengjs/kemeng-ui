function formatMs(milliseconds: number) {
	return `${Math.round(milliseconds)}ms`
}

export type CreateTransitionProps = string | string[]
export type CreateTransitionOptions = Partial<{
	duration: number | string
	easing: string
	delay: number | string
}>

export const createTransition: (
	props: CreateTransitionProps,
	options?: CreateTransitionOptions,
	standard?: number,
	easeInOut?: string
) => string = (props = ['all'], options = {}, standard, easeInOut) => {
	const {
		duration: durationOption = standard,
		easing: easingOption = easeInOut,
		delay = 0
	} = options

	return (Array.isArray(props) ? props : [props])
		.map(
			animatedProp =>
				`${animatedProp} ${
					typeof durationOption === 'string'
						? durationOption
						: formatMs(durationOption)
				} ${easingOption} ${typeof delay === 'string' ? delay : formatMs(delay)}`
		)
		.join(',')
}

export const getTransitionNum = (value: string) => {
	if (!value) {
		return 0
	}

	return Number(value.match(/^\d+/)[0])
}
