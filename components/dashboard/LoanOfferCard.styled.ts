import { css } from '@emotion/react'
import styled from '@emotion/styled'
import {
	StyledAttributeCard,
	StyledAttributeName,
	StyledAttributeValue,
} from '../ui'
import { Img } from 'react-image'
import { Box, Flex, Text } from 'theme-ui'

export const Title = styled(Text)`
	font-style: normal;
	font-weight: 700;

	letter-spacing: -0.02em;

	color: ${props => props.theme.colors.natural50};
`

Title.defaultProps = {
	sx: {
		fontSize: ['21px', '36px'],
		lineHeight: ['30px', '44px'],
	},
}

export const Subtitle = styled(Text)`
	font-style: normal;
	font-weight: 500;

	letter-spacing: -0.02em;

	color: ${props => props.theme.colors.natural300};
`

Subtitle.defaultProps = {
	sx: {
		fontSize: ['14px'],
		lineHeight: ['30px', '28px'],
	},
}

Subtitle.defaultProps = {
	sx: {},
}

export const ImageSection = styled(Flex)`
	align-items: center;
	justify-content: center;
	position: relative;
	border-radius: 8px;
	overflow: hidden;

	aspect-ratio: 1 / 1;

	background: ${props => props.theme.colors.neutral900};
`

ImageSection.defaultProps = {
	sx: {
		borderTopRightRadius: ['8px', 0],
		borderTopLeftRadius: ['8px'],
		borderBottomRightRadius: ['8px', 0],
		borderBottomLeftRadius: ['8px', 0],
		width: [null, '280px'],
	},
}

export const DescriptionSection = styled(Flex)`
	flex-direction: column;
	margin-top: 12px;
`

DescriptionSection.defaultProps = {
	sx: {
		height: ['62px', 'unset'],
	},
}

export const LookingForSection = styled(Flex)`
	flex-direction: column;
	margin-top: 12px;
	height: 88.6px;
	overflow: hidden;
`

export const CardContainer = styled(Flex)`
	width: 100%;
	position: relative;
	padding: 0;
	overflow: hidden;

	background: ${props => props.theme.colors.secondary500};

	border: 1.34px solid ${props => props.theme.colors.dark500};

	box-shadow: '0px 1px 3px rgba(16, 24, 40, 0.1),0px 1px 2px rgba(16, 24, 40, 0.06)';

	border-radius: 10px;

	border-bottom-left-radius: 0;
	border-bottom-right-radius: 0;

	&:hover {
		cursor: pointer;
	}
`

CardContainer.defaultProps = {
	sx: {
		flexDirection: ['column', 'row'],
		borderWidth: '1.34px',
		borderStyle: 'solid',
		borderColor: ['dark500', 'transparent'],
	},
}

export const RightTopImageArea = styled.div`
	z-index: ${props => props.theme.zIndices.listingCardImageOverlay};
	position: absolute;
	right: -6px;
	top: -6px;
	padding: 22px;
`

export const LikeIconContainer = styled(Flex)`
	width: 30px;
	height: 30px;
	align-items: center;
	justify-content: center;
	background: rgba(0, 0, 0, 0.3);
	backdrop-filter: blur(24px);
	border-radius: 4px;
`

export const BottomImageArea = styled.div`
	z-index: ${props => props.theme.zIndices.listingCardImageOverlay};
	position: absolute;
	bottom: 8px;
	margin-left: auto;
	margin-right: auto;
	display: flex;
`

export const PreviewNFTsSection = styled.div`
	flex: 1;
	display: flex;
	height: 41px;
	align-items: center;
	padding-left: 4px;
	padding-right: 4px;
	overflow: hidden;
	gap: 4px;

	max-width: 166px;

	background: rgba(72, 74, 77, 0.3);

	backdrop-filter: blur(24px);

	border-radius: 4px;

	font-style: normal;
	font-weight: 700;
	font-size: 12px;
`

export const Image = styled(Img)`
	max-width: 100%;
	max-height: 100%;
	overflow: hidden;
	z-index: ${props => props.theme.zIndices.listingCardImg};
	position: absolute;

	transition: transform 0.2s;

	&:hover {
		transform: scale(1.02);
	}
`

export const PreviewImage = styled(Image)`
	position: unset;
`

export const PreviewImageContainer = styled.div`
	aspect-ratio: 1/1;
	height: 31px;
	overflow: hidden;
	border-radius: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
`

export const ListingOverlay = styled(Flex)`
	z-index: ${props => props.theme.zIndices.listingCardOverlay};
	background: rgba(7, 21, 29, 0.8);
	backdrop-filter: blur(5px);
	position: absolute;
	inset: 0;
	padding-left: 64px;
	padding-right: 64px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-weight: 500;
	font-size: 16px;
	line-height: 24px;
	text-align: center;

	color: ${props => props.theme.colors.gray600};
`

export const MoreChip = styled(Box)`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	padding: 2px 8px;

	background: ${props => props.theme.colors.primary200};
	border-radius: 16px;

	font-family: 'Inter';
	font-style: normal;
	font-weight: 500;
	font-size: 12px;
	line-height: 18px;
`

export const FundedChip = styled(MoreChip)`
	background: ${props => props.theme.colors.success200};
`

export const DefaultedChip = styled(MoreChip)`
	background: ${props => props.theme.colors.error200};
`

export const AttributeCard = styled(StyledAttributeCard)`
	align-items: flex-start;
	width: 100%;
	display: flex;
	padding: 8px 12px;
`

export const AttributeName = styled(StyledAttributeName)<{ isSmall?: boolean }>`
	font-weight: 600;

	color: ${props => props.theme.colors.gray600};
	text-transform: none;
	line-height: 17px;

	${props =>
		props.isSmall
			? css`
					font-size: 12px;
			  `
			: css`
					font-size: 14px;
			  `}
`

export const AttributeValue = styled(StyledAttributeValue)<{
	isSmall?: boolean
}>`
	align-items: center;
	overflow: hidden;
	font-weight: 600;
	line-height: 19px;

	${props =>
		props.isSmall
			? css`
					font-size: 14px;
			  `
			: css`
					font-size: 16px;
			  `}
`

export const ProgressBarContainer = styled(Flex)`
	flex: 1;
	flex-direction: column;
	margin-top: 8px;
	padding: 0 0px;
	position: relative;
	overflow: hidden;
	border-radius: 4px;

	border: 1.34px solid ${props => props.theme.colors.dark500};
`

export const ProgressBar = styled(Flex)<{
	progress: number
	threshold: number
}>`
	width: ${props => props.progress ?? '0'}%;
	height: 4.8px;
	background: ${props =>
		props.progress > props.threshold
			? props.theme.colors.error200
			: props.theme.colors.success200};
`
