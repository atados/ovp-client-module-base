import * as geoip from 'geoip-lite'
import { IncomingMessage } from 'http'
import { channel } from '~/common/constants'
import { Geolocation } from '~/redux/ducks/geo'

export interface InjectedGeoProps {
  geo: Geolocation
}

export function createGeolocationObject(req: IncomingMessage): Geolocation {
  try {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const geo = geoip.lookup(ip)

    // Lookup region (e.g. SP) into current channel's regions
    if (
      geo &&
      geo.region &&
      (!channel.config.geo.regions ||
        channel.config.geo.regions.some(
          region => String(geo.region) === region,
        ))
    ) {
      return { region: String(geo.region), lat: geo.ll[0], lng: geo.ll[1] }
    }
  } catch (error) {
    console.error(
      'Error trying to get geo location. Fallback to default geo: ',
      error,
    )
  }

  return channel.config.geo.default
}
