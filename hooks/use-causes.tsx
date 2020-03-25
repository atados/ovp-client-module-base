import useStartupData from '~/hooks/use-startup-data'
import { API } from '~/types/api'
import { useMemo } from 'react'

type UseCausesHook = () => {
  causes: API.Cause[] | undefined
  loading: boolean
  error: Error
}

const useCauses: UseCausesHook = () => {
  const result = useStartupData()

  return useMemo(() => ({ ...result, causes: result?.data?.causes }), [result])
}

export default useCauses
