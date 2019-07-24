import { Request } from 'express'
import { fetchAPI } from '~/lib/fetch'
import AuthenticationError from './authentication-error'

export default async (req: Request) => {
  const { name, email, password, is_subscribed_to_newsletter, city } = req.body

  try {
    // create user
    await fetchAPI('/users/', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
        profile: {
          address: {
            typed_address: city,
            city_state: city,
          },
        },
        // eslint-disable-next-line
        is_subscribed_to_newsletter: Boolean(is_subscribed_to_newsletter),
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    let code = '1'

    if (error && error.payload && error.payload.email) {
      code = '2'
    }

    throw new AuthenticationError('Failed to create user', code)
  }
}
