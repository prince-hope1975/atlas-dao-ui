import * as React from 'react'

function TradeAssetImage(props) {
	return (
		<svg
			viewBox='0 0 3966 2882'
			xmlns='http://www.w3.org/2000/svg'
			xmlnsXlink='http://www.w3.org/1999/xlink'
			fillRule='evenodd'
			clipRule='evenodd'
			strokeLinejoin='round'
			strokeMiterlimit={2}
			width={175}
			height={189}
			{...props}
		>
			<use
				xlinkHref='#trade_asset_image'
				x={46}
				y={41}
				width='1671px'
				height='1222px'
				transform='scale(2.27273)'
			/>
			<defs>
				<image
					id='trade_asset_image'
					width='1671px'
					height='1222px'
				/>
			</defs>
		</svg>
	)
}
export default TradeAssetImage