import { IncomingMessage } from 'http'
import { Geolocation } from '~/redux/ducks/geo'
import fetch from 'isomorphic-unfetch'
import { dev } from '~/common/constants'

export interface InjectedGeoProps {
  geo: Geolocation
}
export async function createGeolocationObject(
  req: IncomingMessage,
): Promise<Geolocation> {
  const ip = dev
    ? process.env.DEV_IP
    : req.headers['x-forwarded-for'] || req.connection.remoteAddress

  if (!ip) {
    throw new Error('Unable to figure out ip')
  }

  const geo = await fetch(`https://freegeoip.app/json/${ip}`).then(res =>
    res.json(),
  )

  if (!geo) {
    throw new Error('Failed to find geolocation by ip')
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
