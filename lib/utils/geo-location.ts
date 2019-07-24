import { regionLongNameMap } from '~/common/constants'
import { Geolocation } from '~/redux/ducks/geo'

export function mountAddressFilter(geo: Geolocation) {
  const geoRegionLongName = regionLongNameMap[geo.region]

  if (!geoRegionLongName) {
    return undefined
  }

  return {
    description: geoRegionLongName,
    address_components: [
      {
        types: ['administrative_area_level_1'],
        long_name: geoRegionLongName,
      },
    ],
  }
}
