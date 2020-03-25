import useStartupData from '~/hooks/use-startup-data'
import { API } from '~/types/api'
import { useMemo } from 'react'

type UseChannelStatsHook = () => {
  stats: API.StartupStats | undefined
  loading: boolean
  error: Error
}

const useChannelStats: UseChannelStatsHook = () => {
  const result = useStartupData()

  return useMemo(() => ({ ...result, stats: result?.data?.stats }), [result])
}

export default useChannelStats
