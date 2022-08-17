import * as React from 'react'
import { SVGProps } from 'react'

const SvgFlipVertical20 = (props: SVGProps<SVGSVGElement>) => (
	<svg
		width={20}
		height={20}
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		{...props}
	>
		<path
			fillRule='evenodd'
			clipRule='evenodd'
			d='M3.394 2.34a.75.75 0 0 1 .767.033l8 5.25A.75.75 0 0 1 11.75 9h-8A.75.75 0 0 1 3 8.25V3a.75.75 0 0 1 .394-.66ZM4.5 4.39V7.5h4.74L4.5 4.39ZM3 11.75a.75.75 0 0 1 .75-.75h8a.75.75 0 0 1 .412 1.377l-8 5.25A.75.75 0 0 1 3 17v-5.25Zm1.5.75v3.11l4.74-3.11H4.5ZM15.47 3.47a.75.75 0 0 1 1.06 0l2 2a.75.75 0 0 1-1.06 1.06l-.72-.72v8.38l.72-.72a.75.75 0 1 1 1.06 1.06l-2 2a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 1 1 1.06-1.06l.72.72V5.81l-.72.72a.75.75 0 1 1-1.06-1.06l2-2Z'
			fill='#99A2AD'
		/>
	</svg>
)

export default SvgFlipVertical20
