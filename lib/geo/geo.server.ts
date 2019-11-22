import maxmind from 'maxmind'
import { IncomingMessage } from 'http'
import { Geolocation } from '~/redux/ducks/geo'
import { Config } from '~/base/common'
import * as geolite2 from 'geolite2'

export interface InjectedGeoProps {
  geo: Geolocation
}
let lookup: maxmind.Reader<any> | undefined
export async function createGeolocationObject(
  req: IncomingMessage,
): Promise<Geolocation> {
  try {
    if (!lookup) {
      lookup = maxmind.openSync(geolite2.paths.city)
    }

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const geo = ip && lookup.get(String(ip))

    // Lookup region (e.g. SP) into current channel's regions
    if (geo) {
      return {
        country: String(geo.country.iso_code).toUpperCase(),
        region:
          geo.subdivisions && geo.subdivisions.length
            ? geo.subdivisions[0].iso_code
            : undefined,
        lat: geo.location.latitude,
        lng: geo.location.longitude,
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
