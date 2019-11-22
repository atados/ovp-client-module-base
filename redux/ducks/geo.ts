import { AnyAction } from 'redux'

export interface Geolocation {
  country: string
  region: string
  lat: number
  lng: number
}

export type GeolocationReducerState = Geolocation

export default (geo: Geolocation, action: AnyAction) => {
  if (action.type === 'GEO') {
    return action.payload
  }

  return geo || null
}
