import React from 'react'
import { Box } from 'theme-ui'

import { NotificationOutlineIcon } from '@/assets/icons/20ptOutline'
import { Notifications } from '@/components/shared/notifications'
import { Button } from '@/components/ui'
import { HEADER_HEIGHT } from '@/constants/components'

export default function NotificationsBell() {
	const [expanded, setExpanded] = React.useState(false)

	return (
		<Box sx={{ position: 'relative' }}>
			<Button
				onClick={() => setExpanded(prevExpanded => !prevExpanded)}
				variant='secondary'
				sx={{ padding: '10px' }}
			>
				<NotificationOutlineIcon />
			</Button>
			{expanded && (
				<>
					<Box
						sx={{
							position: ['fixed', 'absolute'],
							top: [`calc(${HEADER_HEIGHT} - 8px)`, 'unset'],
							left: [0, 'unset'],
							right: [0, 'unset'],
							width: ['unset', '341px', '341px'],
							margin: ['0 16px', '4px 0'],
							zIndex: 'headerPopup',
						}}
					>
						<Notifications />
					</Box>
					<Box
						onClick={() => setExpanded(false)}
						sx={{
							position: ['fixed'],
							inset: 0,
							zIndex: 'headerPopupBackgroundOverlay',
						}}
					/>
				</>
			)}
		</Box>
	)
}
