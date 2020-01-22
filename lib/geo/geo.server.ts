import { CountryRecord, LocationRecord } from 'maxmind'
import { IncomingMessage } from 'http'
import { Geolocation } from '~/redux/ducks/geo'
import { WebServiceClient } from '@maxmind/geoip2-node'

const client = new WebServiceClient('157941', 'jtPyO1uN9KGAFqqg')

export interface InjectedGeoProps {
  geo: Geolocation
}
export async function createGeolocationObject(
  req: IncomingMessage,
): Promise<Geolocation> {
  const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress

  if (!ip) {
    throw new Error('Unable to figure out ip')
  }

  const geo = await client.city(String(ip))

  if (!geo) {
    throw new Error('Failed to find geolocation by ip')
  }

  const firstSubdivision = geo.subdivisions[0]
  const location = geo.location as LocationRecord

  if (!firstSubdivision) {
    throw new Error("Fetched geolocation wasn't complete")
  }

  return {
    country: String((geo.country as CountryRecord).iso_code).toUpperCase(),
    region: firstSubdivision.isoCode,
    lat: location.latitude,
    lng: location.longitude,
  }
}
