type DataLayerEvent = string | number | boolean | null | Date
export interface DataLayerMessage {
  [variableName: string]: DataLayerEvent
}

declare global {
  interface Window {
    dataLayer: DataLayerMessage[]
  }
}

export function setupDataLayer(gtmId: string) {
  window.dataLayer = window.dataLayer || []
  pushToDataLayer({
    js: new Date(),
    config: gtmId,
  })
}

const isBrowser = typeof window !== 'undefined'
export function pushToDataLayer(event: DataLayerMessage) {
  if (isBrowser && window.dataLayer) {
    window.dataLayer.push(event)
  }
}
