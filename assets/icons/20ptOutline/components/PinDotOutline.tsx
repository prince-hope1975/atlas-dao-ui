import * as React from 'react'
import { SVGProps } from 'react'

const SvgPinDotOutline20 = (props: SVGProps<SVGSVGElement>) => (
	<svg
		width={20}
		height={20}
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		{...props}
	>
		<path d='M6.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z' fill='#99A2AD' />
		<path
			fillRule='evenodd'
			clipRule='evenodd'
			d='M12.598 2.22a.75.75 0 0 0-1.266.384l-.308 1.54a.297.297 0 0 1-.08.151L8.48 6.76a.297.297 0 0 1-.187.086l-3.859.296c-.883.093-1.238 1.124-.638 1.725l3.139 3.138-4.788 4.8a.75.75 0 0 0 1.133.977l4.716-4.716 3.139 3.14c.62.619 1.659.214 1.724-.638l.297-3.859a.297.297 0 0 1 .086-.187l2.463-2.463a.296.296 0 0 1 .152-.082l1.54-.308a.75.75 0 0 0 .383-1.265L12.598 2.22Zm-.594 3.136c.332-.336.443-.675.524-1.084l3.2 3.2c-.439.067-.781.223-1.083.525l-2.463 2.463c-.292.318-.488.695-.522 1.133l-.216 2.8-5.837-5.837 2.8-.216c.428-.033.83-.217 1.134-.52l2.463-2.464Z'
			fill='#99A2AD'
		/>
	</svg>
)

export default SvgPinDotOutline20