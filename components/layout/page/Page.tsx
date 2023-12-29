import React from 'react'
import Head from 'next/head'
import { Flex } from 'theme-ui'
import { Footer } from '../footer'
import Header from '../header/Header'
import { WalletLoader } from '../../wallet/WalletLoader'
import { useWallet } from '@cosmos-kit/react'
export interface PageProps {
	children?: React.ReactNode | React.ReactNode[]
	title: string
}

export const Page = (props: PageProps) => {
	const { title, children } = props
	
	const wallet = useWallet()
	return (
		<>
		  <Head>
			<meta
			  name='viewport'
			  content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
			/>
			<title>{title}</title>
		  </Head>
		  <Flex variant='appContainer' style={{ position: 'relative' }}>
			<Header />
			{children}
			<Footer />
			{/* WalletLoader component positioned at the bottom right corner */}
			<div
			  style={{
				position: 'fixed',
				bottom: '16px',
				right: '16px',
				zIndex: 1000, // Set a higher z-index to ensure it appears above other elements
			  }}
			>
			  {/* <WalletLoader /> */}
			</div>
		  </Flex>
		</>
	  );
	};


export default Page
