import { User } from '~/base/redux/ducks/user'
import { getRandomColor } from '../color/manager'
import { fetchAPI } from '../fetch'

export default async function deserializeUser(token: string): Promise<User> {
  const user = await fetchAPI<User>('/users/current-user/', {
    sessionToken: token,
  })

  user.profile = user.profile || { causes: [], skills: [] }
  user.profile.color = getRandomColor()

  return user
}
