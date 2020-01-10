import { InputSelectItem } from '~/components/InputSelect/InputSelect'
import { API } from '~/types/api'

export const causeToSelectItem = (cause: API.Cause): InputSelectItem => ({
  value: cause.id,
  label: cause.name,
})

export const skillToSelectItem = (skill: API.Skill): InputSelectItem => ({
  value: skill.id,
  label: skill.name,
})
