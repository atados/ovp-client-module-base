export interface Geolocation {
  country: string
  region: string
  lat: number
  lng: number
}

export type GeolocationReducerState = Geolocation

export default (
  geo: Geolocation = {
    country: 'BR',
    region: 'SP',
    lat: -23.5283838,
    lng: -46.6021955,
  },
) => geo
