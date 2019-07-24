import { InputSelectItem } from '~/components/InputSelect/InputSelect'
import { Cause, Skill } from '~/redux/ducks/channel'

export const causeToSelectItem = (cause: Cause): InputSelectItem => ({
  value: cause.id,
  label: cause.name,
})

export const skillToSelectItem = (skill: Skill): InputSelectItem => ({
  value: skill.id,
  label: skill.name,
})
