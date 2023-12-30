import * as React from 'react'

function NotFoundImage(props) {
	return (
		<svg
			viewBox='0 0 5578 4303'
			xmlns='http://www.w3.org/2000/svg'
			xmlnsXlink='http://www.w3.org/1999/xlink'
			fillRule='evenodd'
			clipRule='evenodd'
			strokeLinejoin='round'
			strokeMiterlimit={2}
			width='100%'
			height='100%'
			{...props}
		>
			<use
				xlinkHref='#not_found_image'
				x={65}
				y={41}
				width='2389px'
				height='1784px'
				transform='scale(2.27273)'
			/>
			<defs>
				<image
					id='not_found_image'
					width='2389px'
					height='1784px'
				/>
			</defs>
		</svg>
	)
}
export default NotFoundImage