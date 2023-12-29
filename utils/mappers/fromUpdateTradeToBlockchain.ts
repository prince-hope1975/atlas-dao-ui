import { LOOKING_FOR_TYPE } from '@/constants/trade'
import networkUtils, { amountConverter } from '@/utils/blockchain/networkUtils'

export function fromUpdateTradeToBlockchain({
	tokenAmount,
	tokenName,
	comment,
	nftsWanted,
	lookingForType,
}) {
	const newTokensWanted =
		lookingForType === LOOKING_FOR_TYPE.ANY || !tokenAmount
			? []
			: [
					{
						amount: amountConverter.default.userFacingToBlockchainValue(
							Number(tokenAmount)
						),
						denom: networkUtils.getDenomForCurrency(tokenName),
					},
			  ]

	const newNFTsWanted = lookingForType === LOOKING_FOR_TYPE.ANY ? [] : nftsWanted

	return {
		newTokensWanted,
		newNFTsWanted,
		comment,
		tokenAmount,
		tokenName,
	}
}
