import React, { useRef } from 'react'
import { ThemeUIStyleObject } from 'theme-ui'
import { useOnClickOutside } from 'utils/react/useOnClickOutside'
import { ModalContainer, ModalWrapper } from './Modal.styled'

export interface ModalProps {
	isOpen: boolean
	children: React.ReactNode
	onCloseModal: () => void
	sx?: ThemeUIStyleObject
}

const Modal: React.FunctionComponent<ModalProps> = ({
	isOpen = false,
	onCloseModal,
	children,
}) => {
	const containerRef = useRef(null)
	useOnClickOutside(containerRef, onCloseModal)

	if (!isOpen) return null

	return (
		<ModalWrapper isOpen={isOpen}>
			<ModalContainer ref={containerRef}>{children}</ModalContainer>
		</ModalWrapper>
	)
}

export default Modal
