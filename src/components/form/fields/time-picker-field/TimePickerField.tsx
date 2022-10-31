import {
	FieldContainer,
	FieldError,
	FieldLabel,
} from 'components/form/components'
import TimePicker, {
	TimePickerProps,
} from 'components/ui/time-picker/TimePicker'
import { withForwardRef } from 'hoc'
import React from 'react'
import TimePickerRef from 'react-flatpickr'

export interface TimePickerFieldProps extends TimePickerProps {
	error?: boolean
	fieldError?: string
	iconLeft?: React.ReactNode
	forwardedRef?: React.RefObject<TimePickerRef>
	label: string
}

const TimePickerField = ({
	fieldError,
	forwardedRef,
	label,
	...props
}: TimePickerFieldProps) => {
	const inputRef = React.useRef<TimePickerRef>(null)

	React.useImperativeHandle(
		forwardedRef,
		() => inputRef.current as TimePickerRef
	)

	return (
		<FieldContainer>
			<FieldLabel htmlFor={props.name}>{label}</FieldLabel>
			<TimePicker ref={inputRef} {...props} />
			<FieldError>{fieldError || null}</FieldError>
		</FieldContainer>
	)
}

export default withForwardRef<TimePickerRef, TimePickerFieldProps>(
	TimePickerField
)
