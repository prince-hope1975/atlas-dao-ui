import { useQuery } from '@tanstack/react-query'
import {
	NAME_SERVICE_REGISTERED_DOMAINS,
	NAME_SERVICE_REGISTERED_DOMAIN_INFO,
} from '../constants/useQueryKeys'
import pMap from 'p-map'
import { NameServiceContract } from '../services/blockchain/contracts/nameservice'

export default function useNameService(addresses: string[]) {
	const { data: reverseRecords } = useQuery(
		[NAME_SERVICE_REGISTERED_DOMAINS, addresses],
		async () => NameServiceContract.reverseRecords(addresses),
		{
			enabled: !!addresses.length,
			retry: 5,
		}
	)

	const { data: nameServiceInfo } = useQuery(
		[NAME_SERVICE_REGISTERED_DOMAIN_INFO, addresses, reverseRecords],
		async () =>
			pMap(
				reverseRecords?.records ?? [],
				async record =>
					record.record?.tokenId
						? NameServiceContract.getDomainInfo(record.record?.tokenId ?? '')
						: null,
				{
					concurrency: 5,
				}
			),
		{
			enabled: !!reverseRecords?.records.length,
			retry: 5,
		}
	)

	return nameServiceInfo ?? []
}
