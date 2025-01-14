import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { withForwardRef } from '@/hoc'
import { noop } from 'lodash'
import React, { MouseEventHandler } from 'react'
import {
	Button as ThemeUIButton,
	ThemeUIStyleObject,
	ButtonProps as ThemeUIButtonProps,
} from 'theme-ui'

export type ButtonTypeVariants =
	| 'primary'
	| 'secondary'
	| 'ghost'
	| 'destructive'
	| 'dark'
	| 'gradient'
	| 'select'

export type ButtonSizeVariants = 'small' | 'medium' | 'large' | 'extraLarge'

export interface ButtonProps {
	fullWidth?: boolean
	disabled?: boolean
	sx?: ThemeUIStyleObject
	forwardedRef?: React.LegacyRef<HTMLButtonElement | HTMLAnchorElement>

	variant?: ButtonTypeVariants

	size?: ButtonSizeVariants

	startIcon?: React.ReactNode
	endIcon?: React.ReactNode

	children: React.ReactNode
	onClick?: MouseEventHandler<HTMLButtonElement>
}

const StyledButton = styled(ThemeUIButton, {
	shouldForwardProp: prop => prop !== 'fullWidth',
})<ButtonProps>`
	${props => (props.fullWidth ? 'flex: 1' : '')}
`

export const StartIconContainer = styled.span`
	margin-right: 11px;
`

export const EndIconContainer = styled.span`
	margin-left: 11px;
`
const Button = (props: ButtonProps & ThemeUIButtonProps) => {
	const theme = useTheme()

	const {
		startIcon,
		endIcon,
		children,
		size = 'medium',
		forwardedRef,
		sx,
		...attrs
	} = props

	return (
		<StyledButton
			{...attrs}
			ref={forwardedRef as React.Ref<HTMLButtonElement>}
			sx={{
				...theme.buttons.sizes[size],
				...sx,
			}}
		>
			{/* {loading ? <LoadingCircular size={16} /> : icon} */}
			<>
				{startIcon && <StartIconContainer>{startIcon}</StartIconContainer>}
				{children}
				{endIcon && <EndIconContainer>{endIcon}</EndIconContainer>}
			</>
		</StyledButton>
	)
}

Button.defaultProps = {
	fullWidth: false,
	disabled: false,

	// Style variant
	variant: 'primary',

	// Size variants
	size: 'medium',
	type: 'button',

	onClick: noop,
	sx: {},
}

export default withForwardRef<
	HTMLButtonElement,
	ButtonProps & ThemeUIButtonProps
>(Button)
