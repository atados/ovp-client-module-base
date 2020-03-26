import useStartupData from '~/hooks/use-startup-data'
import { API } from '~/types/api'
import { useMemo } from 'react'

type UseSkillsHook = () => {
  skills: API.Skill[] | undefined
  loading: boolean
  error: Error
}

const useSkills: UseSkillsHook = () => {
  const result = useStartupData()

  return useMemo(() => ({ ...result, skills: result?.data?.skills }), [result])
}

export default useSkills
