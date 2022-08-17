import * as React from 'react'
import { SVGProps } from 'react'

const SvgLiveOutline20 = (props: SVGProps<SVGSVGElement>) => (
	<svg
		width={20}
		height={20}
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		{...props}
	>
		<path d='M11.5 10a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z' fill='#99A2AD' />
		<path
			fillRule='evenodd'
			clipRule='evenodd'
			d='M10 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-1.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z'
			fill='#99A2AD'
		/>
		<path
			fillRule='evenodd'
			clipRule='evenodd'
			d='M10 18.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Zm7-8.5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z'
			fill='#99A2AD'
		/>
	</svg>
)

export default SvgLiveOutline20
