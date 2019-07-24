import { fetchAPI } from '~/lib/fetch'
import { AUTH_CLIENT_ID, AUTH_CLIENT_SECRET } from '~/server/constants'
import { AuthenticationResponse } from './types'

export default async function convertToken(
  backend: string,
  accessToken: string,
  clientId?: string,
  clientSecret?: string,
): Promise<AuthenticationResponse | null> {
  try {
    return await fetchAPI<AuthenticationResponse>('/auth/convert-token/', {
      method: 'POST',
      body: {
        client_id: clientId || AUTH_CLIENT_ID,
        client_secret: clientSecret || AUTH_CLIENT_SECRET,
        grant_type: 'convert_token',
        token: accessToken,
        backend,
      },
    })
  } catch (error) {
    if (
      error.error_description === 'Invalid credentials given.' ||
      error.error_description === 'Your email is not verified by the provider'
    ) {
      return null
    }

    throw error
  }
}
