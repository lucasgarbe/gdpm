import ky from 'ky-universal'
import { useQuery } from '@tanstack/react-query'

const fetchDistributions = async () => {
    const parsed = await ky('/api/distributions').json();
    return parsed;
}

const useDistributions = () => {
  return useQuery({
    queryKey: ['distributions'],
    queryFn: () => fetchDistributions(),
  })
}

export { fetchDistributions, useDistributions }
