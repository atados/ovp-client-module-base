import { CountryRecord, LocationRecord } from 'maxmind'
import { IncomingMessage } from 'http'
import { Geolocation } from '~/redux/ducks/geo'
import { Config } from '~/common'
import { WebServiceClient } from '@maxmind/geoip2-node'

const client = new WebServiceClient('157941', 'jtPyO1uN9KGAFqqg')

export interface InjectedGeoProps {
  geo: Geolocation
}
export async function createGeolocationObject(
  req: IncomingMessage,
): Promise<Geolocation> {
  try {
    const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress
    const geo = await (ip && client.city(String(ip)))

    // Lookup region (e.g. SP) into current channel's regions
    if (geo) {
      const firstSubdivision = geo.subdivisions[0]
      const location = geo.location as LocationRecord

      if (!firstSubdivision) {
        return Config.geo.default
      }

      return {
        country: String((geo.country as CountryRecord).iso_code).toUpperCase(),
        region: firstSubdivision.isoCode,
        lat: location.latitude,
        lng: location.longitude,
      }
    }
  } catch (error) {
    console.error(
      'Error trying to get geo location. Fallback to default geo: ',
      error,
    )
  }

  return Config.geo.default
}
