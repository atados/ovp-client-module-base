import { useSelector, useDispatch } from 'react-redux'
import { useMemo, useEffect, useState } from 'react'

import { RootState } from '~/redux/root-reducer'
import { getStartupData } from '~/lib/startup'
import { API } from '~/types/api'

declare global {
  interface Window {
    fetchAndDispatchStartupPromise: Promise<void>
  }
}

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

export interface UseStartupDataResult {
  data: HookData
  loading: boolean
  error: Error | null
}

export type UseStartupDataHook = () => UseStartupDataResult

/**
 * @example const { data, error, loading} = useStartupData()
 */
const useStartupData: UseStartupDataHook = () => {
  const [error, setError] = useState<Error | null>(null)
  const startup = useSelector((reduxState: RootState) => reduxState.startup)
  const dispatch = useDispatch()

  useEffect(() => {
    if (window.fetchAndDispatchStartupPromise) {
      window.fetchAndDispatchStartupPromise.catch(e => {
        setError(e)
        throw e
      })
      return
    }

    window.fetchAndDispatchStartupPromise = fetchAndDispatchStartup().catch(
      e => {
        setError(e)
        throw e
      },
    )

    async function fetchAndDispatchStartup() {
      if (!startup) {
        const requestedStartupData = await getStartupData()
        dispatch({
          type: 'STARTUP',
          payload: requestedStartupData,
        })
      }
    }
  }, [startup])

  return useMemo(() => {
    if (startup) {
      return {
        error,
        loading: false,
        data: {
          causes: startup.causes,
          skills: startup.skills,
          stats: {
            volunteersCount: startup.stats.volunteers,
            organizationsCount: startup.stats.organizations,
          },
        },
      }
    } else {
      return {
        error,
        loading: true,
        data: undefined,
      }
    }
  }, [startup, error])
}

export function withStartupData<Props>(
  Component: React.ComponentType<Props>,
): React.FC<Props> {
  const Wrapper = props => {
    const startupData = useStartupData()
    return <Component {...(props as Props)} startupData={startupData} />
  }

  // @ts-ignore
  if (Component.getInitialProps) {
    // @ts-ignore
    Wrapper.getInitialProps = Component.getInitialProps
  }

  return Wrapper
}

export default useStartupData
