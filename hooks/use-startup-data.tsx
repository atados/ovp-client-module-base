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
  const result = useAPIFetch('/startup/')

  return useMemo(() => {
    return {
      ...result,
      data: result.data && {
        causes: result.data.causes,
        skills: result.data.skills,
        stats: {
          volunteersCount: result.data.volunteer_count,
          organizationsCount: result.data.nonprofit_count,
        },
      },
    }
  }, [result])
}

export default useStartupData