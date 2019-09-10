import { IncomingMessage } from 'http'

export function createGeolocationObject(_: IncomingMessage) {
  throw new Error('createGeolocationObject called at client environment')
}
