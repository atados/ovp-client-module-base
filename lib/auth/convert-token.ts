import { fetchAPI } from '~/lib/fetch'

const { AUTH_CLIENT_ID, AUTH_CLIENT_SECRET } = process.env

export interface ConvertTokenPayload {
  access_token: string
}

export default async function convertAuthenticationToken(
  provider: string,
  accessToken: string,
  clientId?: string,
  clientSecret?: string,
): Promise<ConvertTokenPayload | null> {
  try {
    return await fetchAPI<ConvertTokenPayload>('/auth/convert-token/', {
      method: 'POST',
      body: {
        client_id: clientId || AUTH_CLIENT_ID,
        client_secret: clientSecret || AUTH_CLIENT_SECRET,
        grant_type: 'convert_token',
        token: accessToken,
        backend: provider,
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
