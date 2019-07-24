import { Express } from 'express'
import * as geoip from 'geoip-lite'
import { channel } from '~/common/constants'
import { Geolocation } from '~/redux/ducks/geo'
import { ChannelRequest } from '~/server/channel/setup'

export interface InjectedGeoProps {
  geo: Geolocation
}

export function insertGeoToRequest(req: ChannelRequest & InjectedGeoProps) {
  try {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const geo = geoip.lookup(ip)

    // Lookup region (e.g. SP) into current channel's regions
    if (
      geo &&
      geo.region &&
      (!channel.geo.regions ||
        channel.geo.regions.some(region => String(geo.region) === region))
    ) {
      req.geo = { region: String(geo.region), lat: geo.ll[0], lng: geo.ll[1] }
    } else {
      req.geo = channel.geo.default
    }
  } catch (error) {
    console.error(
      'Error trying to get geo location. Fallback to default geo: ',
      error,
    )
    req.geo = channel.geo.default
  }
}

const RE_USER_NOT_NEEDED_URL = /^\/(_next)/
export default (server: Express) => {
  server.use((req, _, next) => {
    // Prevent user fetching at dev-only routes
    if (RE_USER_NOT_NEEDED_URL.test(req.url)) {
      next()
      return
    }

    insertGeoToRequest(req as any)
    next()
  })
}
