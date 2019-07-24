import { useCallback, useEffect, useMemo, useState } from 'react'
import { Omit } from 'react-redux'

interface LocalStorageHookResult<Value> {
  value: Value
  loading: boolean
  update: (newValue: Value) => void
}

export default <Value>(
  key: string,
  defaultValue: Value,
): LocalStorageHookResult<Value> => {
  const [state, setState] = useState<
    Omit<LocalStorageHookResult<Value>, 'update'>
  >({ value: defaultValue, loading: true })
  const update = useCallback(
    (newValue: Value) => {
      if (process.browser) {
        localStorage.setItem(key, JSON.stringify(newValue))
        setState({ value: newValue, loading: false })
      }
    },
    [setState],
  )

  useEffect(() => {
    const json = localStorage.getItem(key)
    setState({ value: json ? JSON.parse(json) : defaultValue, loading: false })
  }, [])
  const result: LocalStorageHookResult<Value> = useMemo(() => {
    return { ...state, update }
  }, [state])

  return result
}
