import { cx, styled } from '@linaria/atomic'
import { forwardRef } from 'react'
import { themeVariables } from '../../utils'
import { getK, unit } from '../../utils/style'
import {
	NativeJSXElementsWithoutRef,
	withNativeElementProps
} from '../../utils/nativeProps'

const k = getK('Divider')

const DividerRoot = styled.div`
	margin: 0;
	flex-shrink: 0;
	border-width: 0;
	border-style: solid;
	border-color: ${themeVariables.divider};
	border-bottom-width: thin;

	&.${k('absolute')} {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
	}

	&.${k('light')} {
		border-color: ${themeVariables.dividerLight};
	}

	&.${k('inset')} {
		margin-left: ${unit(9)};
	}

	&.${k('middle')}.${k('horizontal')} {
		margin-left: ${unit(2)};
		margin-right: ${unit(2)};
	}

	&.${k('middle')}.${k('vertical')} {
		margin-top: ${unit(1)};
		margin-bottom: ${unit(1)};
	}

	&.${k('vertical')} {
		height: 100%;
		border-bottom-width: 0;
		border-right-width: thin;
	}

	&.${k('flexItem')} {
		align-self: stretch;
		height: auto;
	}

	&.${k('children')} {
		display: flex;
		white-space: nowrap;
		text-align: center;
		border: 0;
		&::before,
		&::after {
			content: '';
			align-self: center;
		}

		&.${k('horizontal')} {
			&::before,
			&::after {
				width: 100%;
				border-top: thin solid ${themeVariables.divider};
			}
		}

		&.${k('vertical')} {
			flex-direction: column;
			&::before,
			&::after {
				height: 100%;
				border-left: thin solid ${themeVariables.divider};
			}
		}
	}

	&.${k('horizontal')} {
		&.${k('right')} {
			&::before {
				width: 90%;
			}
			&::after {
				width: 10%;
			}
		}
		&.${k('left')} {
			&::before {
				width: 10%;
			}
			&::after {
				width: 90%;
			}
		}
	}
`

const DividerWrapper = styled.span`
	display: inline-block;
	padding-left: ${unit(1.2)};
	padding-right: ${unit(1.2)};
	&.${k('vertical')} {
		padding-top: ${unit(1.2)};
		padding-bottom: ${unit(1.2)};
	}
`

export type DividerProps = {
	/**
	 * Absolutely position the element.
	 * @default false
	 */
	absolute?: boolean
	/**
	 * If `true`, a vertical divider will have the correct height when used in flex container.
	 * (By default, a vertical divider will have a calculated height of `0px` if it is the child of a flex container.)
	 * @default false
	 */
	flexItem?: boolean
	/**
	 * If `true`, the divider will have a lighter color.
	 * @default false
	 * @deprecated Use <Divider sx={{ opacity: 0.6 }} /> (or any opacity or color) instead. [How to migrate](/material-ui/migration/migrating-from-deprecated-apis/)
	 */
	light?: boolean
	/**
	 * The component orientation.
	 * @default 'horizontal'
	 */
	orientation?: 'horizontal' | 'vertical'
	/**
	 * The text alignment.
	 * @default 'center'
	 */
	textAlign?: 'center' | 'right' | 'left'
	/**
	 * @default 'fullWidth'
	 */
	variant?: 'fullWidth' | 'inset' | 'middle'
	DividerWrapperClassName?: string
} & NativeJSXElementsWithoutRef<'div'>

const Divider = forwardRef<HTMLDivElement, DividerProps>((p, ref) => {
	const {
		absolute = false,
		children,
		flexItem = false,
		light = false,
		orientation = 'horizontal',
		role = 'separator',
		textAlign = 'center',
		variant = 'fullWidth',
		DividerWrapperClassName
	} = p

	return withNativeElementProps(
		p,
		<DividerRoot
			className={cx(
				absolute && k('absolute'),
				light && k('light'),
				variant === 'middle' && k('middle'),
				variant === 'inset' && k('inset'),
				orientation === 'horizontal' ? k('horizontal') : k('vertical'),
				flexItem && k('flexItem'),
				!!children && k('children'),
				textAlign === 'left' && k('left'),
				textAlign === 'right' && k('right')
			)}
			role={role}
			ref={ref}
		>
			{children ? (
				<DividerWrapper
					className={cx(
						orientation === 'vertical' && k('vertical'),
						DividerWrapperClassName
					)}
				>
					{children}
				</DividerWrapper>
			) : null}
		</DividerRoot>
	)
})

export default Divider
