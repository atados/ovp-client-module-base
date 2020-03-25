import { useAPIFetch } from '~/hooks/use-api-fetch'
import { API } from '~/types/api'

type StartupData = {
  causes: API.Cause[]
  skills: API.Skill[]
  stats: API.StartupStats
}

type HookData = StartupData | undefined

type UseStartupDataHook = () => {
  data: HookData
  loading: boolean
  error: Error
}

const useStartupData: UseStartupDataHook = () => {
  const { data, loading, error } = useAPIFetch('/startup/')
  let startupData: HookData = undefined
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

  return {
    data: startupData,
    loading,
    error,
  }
}

export default useStartupData
