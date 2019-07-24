/// <reference types="googlemaps" />

let service: google.maps.places.AutocompleteService
export function setup() {
  if (!google) {
    console.error(
      'Google Maps JavaScript API library must be loaded. See: https://github.com/kenny-hibino/react-places-autocomplete#load-google-library',
    )
    return
  }

  service = new google.maps.places.AutocompleteService()
}

export function getPlacePredictions(
  request: google.maps.places.AutocompletionRequest,
): Promise<google.maps.places.AutocompletePrediction[]> {
  if (!service) {
    setup()
  }

  const { OK } = google.maps.places.PlacesServiceStatus
  return new Promise((resolve, reject) => {
    service.getPlacePredictions(request, (nodes, status) => {
      if (status !== OK) {
        reject(status)
        return
      }

      resolve(nodes)
    })
  })
}
