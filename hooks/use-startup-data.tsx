import { useSelector, useDispatch } from 'react-redux'
import { useMemo, useEffect, useState } from 'react'

import { RootState } from '~/redux/root-reducer'
import { getStartupData } from '~/lib/startup'
import { API } from '~/types/api'

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
  const startup = useSelector(
    (reduxState: RootState) => reduxState.startup,
  ) as any
  const dispatch = useDispatch()

  useEffect(() => {
    if (window.fetchAndDispatchStartupPromise) {
      window.fetchAndDispatchStartupPromise.catch(e => {
        setError(e)
        throw e
      })
      return
    }
    async function fetchAndDispatchStartup() {
      if (!startup) {
        dispatch({
          type: 'STARTUP',
          payload: await getStartupData(),
        })
      }
    }
    window.fetchAndDispatchStartupPromise = fetchAndDispatchStartup().catch(
      e => {
        setError(e)
        throw e
      },
    )
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
            volunteersCount: startup.stats.volunteer_count,
            organizationsCount: startup.stats.nonprofit_count,
          },
        },
      }
    } else {
      return {
        error: null,
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
