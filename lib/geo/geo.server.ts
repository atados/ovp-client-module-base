import maxmind, { CountryResponse } from 'maxmind'
import { IncomingMessage } from 'http'
import { channel, dev } from '~/common/constants'
import { Geolocation } from '~/redux/ducks/geo'
import { Config } from '~/base/common'
import * as path from 'path'

export interface InjectedGeoProps {
  geo: Geolocation
}
let lookup
export async function createGeolocationObject(
  req: IncomingMessage,
): Promise<Geolocation> {
  try {
    if (!lookup) {
      lookup = maxmind.openSync<CountryResponse>(
        dev
          ? path.resolve('base', 'lib', 'geo', 'GeoLite2-Country.mmdb')
          : path.join(__dirname, 'GeoLite2-Country.mmdb'),
      )
    }

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const geo = ip && lookup.get(ip)

    // Lookup region (e.g. SP) into current channel's regions
    if (
      geo &&
      geo.region &&
      (!channel.config.geo.regions ||
        channel.config.geo.regions.some(
          region => String(geo.region) === region,
        ))
    ) {
      return {
        country: String(geo.country).toUpperCase(),
        region: String(geo.region).toUpperCase(),
        lat: geo.ll[0],
        lng: geo.ll[1],
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
