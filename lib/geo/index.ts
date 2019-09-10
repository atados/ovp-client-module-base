const GeoModule =
  typeof window === 'undefined'
    ? // tslint:disable-next-line:no-var-requires
      require('./geo.server')
    : // tslint:disable-next-line:no-var-requires
      require('./geo.client')

export const createGeolocationObject = GeoModule.createGeolocationObject
