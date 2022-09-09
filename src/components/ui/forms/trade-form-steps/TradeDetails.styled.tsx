import styled from '@emotion/styled'
import { Card } from 'components'

import { Flex, Text } from 'theme-ui'

export const ContentCardWrapper = styled.div`
	flex: 1;
	flex-direction: column;
`

export const ContentCard = styled(Card)`
	border-radius: 12px;
`
ContentCard.defaultProps = {
	sx: {
		p: ['16px', '16px', '24px', '24px'],
		minHeight: [null, null, null, '393px'],
	},
}

export const ContentCardTitle = styled(Text)``

ContentCardTitle.defaultProps = {
	as: 'h3',
	variant: 'textXlSemibold',
	sx: { lineHeight: '32px' },
	color: 'neutral50',
}

export const ContentCardSubtitle = styled(Text)`
	padding: 2px 0 16px;
`

ContentCardSubtitle.defaultProps = {
	as: 'p',
	variant: 'textSmRegular',
	color: 'gray700',

	sx: { lineHeight: '20px' },
}

export const CardItem = styled(Flex)`
	flex: 1;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
	border: 2px solid ${props => props.theme.colors.secondary400};
	cursor: pointer;
	position: relative;
	transition: background-color 0.2s ease-in;

	&:hover {
		background-color: ${props => props.theme.colors.primary600};
	}
`

CardItem.defaultProps = {
	sx: {
		py: ['46px'],
	},
	backgroundColor: 'dark100',
}

export const CardItemText = styled(Text)``

CardItemText.defaultProps = {
	as: 'h4',
	sx: {
		fontFamily: 'Heebo',
		fontSize: '16px',
		lineHeight: '24px',
		fontWeight: 500,
		textAlign: 'center',
		padding: '4px 12px 0',
	},
	color: 'natural50',
}

export const CardItemInput = styled.input`
	/* display: none; */
	opacity: 0;
	position: absolute;
	inset: 0;
	cursor: pointer;
`

export const FormWrapper = styled.div`
	display: flex;
	flex-direction: column;
`

export const RadioWrapper = styled(Flex)`
	gap: 8px;
`
RadioWrapper.defaultProps = {
	sx: {},
}

export const Label = styled.label`
	color: ${props => props.theme.colors.gray1000};
	font-weight: 600;
	font-size: 16px;
	line-height: 20px;
	display: block;
	padding-bottom: 6px;
`

export const ChipsWrapper = styled(Flex)`
	/* REMOVE SCROLLBAR */
	-ms-overflow-style: none; /* Internet Explorer 10+ */
	scrollbar-width: none; /* Firefox */
	&::-webkit-scrollbar {
		width: 0; /* Remove scrollbar space */
		height: 0; /* Remove scrollbar height issue */
	}
`

ChipsWrapper.defaultProps = {
	mt: ['8px', '8px', '4px'],
	sx: {
		gap: ['4px', '4px', '2px'],
		flexWrap: ['nowrap', 'nowrap', 'wrap'],
		overflowX: ['auto', 'auto', 'visible'],
	},
}