import * as React from 'react'
import { SVGProps } from 'react'

const SvgLikeOutline20 = (props: SVGProps<SVGSVGElement>) => (
	<svg
		width={20}
		height={20}
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		{...props}
	>
		<path
			d='M13.629 2.5A5.371 5.371 0 0 1 19 7.871c0 2.837-1.081 4.275-5.702 7.869l-1.993 1.55a2.125 2.125 0 0 1-2.61 0l-1.993-1.55C2.082 12.146 1 10.708 1 7.87A5.371 5.371 0 0 1 6.371 2.5c1.256 0 2.403.46 3.414 1.346l.215.197.215-.197c1.01-.886 2.158-1.346 3.414-1.346Zm0 1.5c-1.124 0-2.137.53-3.055 1.622a.75.75 0 0 1-1.148 0C8.508 4.53 7.496 4 6.37 4A3.871 3.871 0 0 0 2.5 7.871c0 2.238.838 3.352 5.123 6.685l1.993 1.55a.625.625 0 0 0 .768 0l1.993-1.55c4.09-3.182 5.04-4.341 5.118-6.386l.005-.299A3.871 3.871 0 0 0 13.629 4Z'
			fill='#99A2AD'
		/>
	</svg>
)

export default SvgLikeOutline20
