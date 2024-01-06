import { ChainId } from '../types'

export const LCD_URLS: { [key in ChainId]: string } = {
	'elgafar-1': '', // https://pisco-lcd.terra.dev
	'stargaze-1': '', // https://phoenix-lcd.terra.dev
}

export const FCD_URLS: { [key in ChainId]: string } = {
	'elgafar-1': '', // https://pisco-fcd.terra.dev
	'stargaze-1': '', // https://phoenix-fcd.terra.dev
}

export const CHAIN_DENOMS: { [key in ChainId]: string } = {
	'elgafar-1': 'ustars',
	'stargaze-1': 'ustars',
}

export const CHAIN_CURRENCIES: { [key in ChainId]: string } = {
	'elgafar-1': 'stars',
	'stargaze-1': 'stars',
}

export const API_URL = 'http://localhost:3000' // https://api.illiquidlabs.io/

export const ASSETS_URL = '' // https://assets.terra.dev/

export const DRAND_URL =
	'' // https://api.drand.sh/8990e7a9aaed2ffed73dbd7092123d6f289930540d7651336225dc172e51b2ce

export const BLOCKS_PER_DAY = 14500 // around 1 block every 6 seconds
