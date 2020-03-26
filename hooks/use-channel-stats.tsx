import useStartupData, { StartupStats } from '~/hooks/use-startup-data'
import { useMemo } from 'react'

type UseChannelStatsHook = () => {
  stats: StartupStats | undefined
  loading: boolean
  error: Error
}

const useChannelStats: UseChannelStatsHook = () => {
  const result = useStartupData()

  return useMemo(() => ({ ...result, stats: result?.data?.stats }), [result])
}

export default useChannelStats
