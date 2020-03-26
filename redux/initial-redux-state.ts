import { IncomingMessage } from 'http'
import { RootState } from '~/redux/root-reducer'
import { Config } from '~/common'

export const resolveInitialReduxState = (
  givenInitialState?: Partial<RootState>,
  ctx?: { req?: IncomingMessage },
): Partial<RootState> => {
  let initialState = givenInitialState
  if (!givenInitialState && ctx?.req) {
    const defaultGeo = Config.geolocation.default
    initialState = {
      geo: {
        country: defaultGeo.countryCode,
        region: defaultGeo.regionCode,
        lat: defaultGeo.latitude,
        lng: defaultGeo.longitude,
      },
    }
  }

  return initialState || {}
}
