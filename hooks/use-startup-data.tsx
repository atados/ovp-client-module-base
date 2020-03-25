import { useAPIFetch } from '~/hooks/use-api-fetch'
import { API } from '~/types/api'
import { useMemo } from 'react'

export interface StartupStats {
  volunteersCount: number
  organizationsCount: number
}

interface StartupData {
  causes: API.Cause[]
  skills: API.Skill[]
  stats: StartupStats
}

type HookData = StartupData | undefined

type UseStartupDataHook = () => {
  data: HookData
  loading: boolean
  error: Error
}

/**
 * @example const { data, error, loading} = useStartupData()
 */
const useStartupData: UseStartupDataHook = () => {
  const { data, loading, error } = useAPIFetch('/startup/')
  let startupData: HookData
  if (data) {
    startupData = {
      causes: data.causes,
      skills: data.skills,
      stats: {
        volunteersCount: data.volunteer_count,
        organizationsCount: data.nonprofit_count,
      },
    }
  }

  return useMemo(
    () => ({
      data: startupData,
      loading,
      error,
    }),
    [data, loading, error],
  )
}

export default useStartupData
