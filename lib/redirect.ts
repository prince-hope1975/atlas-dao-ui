import { useRouter } from 'next/router'
// import languageDetector from './languageDetector'

export const useRedirect = (param?: string) => {
	const router = useRouter()

	// const to = param || router.asPath

	// language detection
	// useEffect(() => {
	// 	// const detectedLng = languageDetector.detect()
	// 	if ( router.route === '/404') {
	// 		// prevent endless loop
	// 		router.replace(`/${router.route}`)
	// 		return
	// 	}
	// 	// languageDetector?.cache?.(detectedLng as string)
	// 	router.replace(`/${to}`)
	// }, [])

	return null
}

export const Redirect = ({ to }: { to: string }) => {
	useRedirect(to)
	return null
}

export const getRedirect = (to: string | undefined) => () => {
	useRedirect(to)
	return null
}
