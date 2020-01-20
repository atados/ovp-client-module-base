import { IncomingMessage } from 'http'
import { Geolocation } from '~/redux/ducks/geo'
import fetch from 'isomorphic-unfetch'

export interface InjectedGeoProps {
  geo: Geolocation
}
export async function createGeolocationObject(
  req: IncomingMessage,
): Promise<Geolocation | null> {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

  if (!ip) {
    return null
  }

  const geo = await fetch(`https://freegeoip.app/json/${ip}`).then(res =>
    res.json(),
  )

  if (!geo) {
    return null
  }

  const {
    region_code: region,
    country_code: country,
    latitude: lat,
    longitude: lng,
  } = geo

  return {
    country,
    region,
    lat,
    lng,
  }
}
