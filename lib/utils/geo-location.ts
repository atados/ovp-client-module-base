import { regionLongNameMap } from '~/common/constants'
import { Geolocation } from '~/redux/ducks/geo'
import { AddressSearchFilter } from '~/redux/ducks/search'
import { Config } from '~/common'

export function mountAddressFilter(
  geo: Geolocation,
  givenAddress?: AddressSearchFilter | null,
): AddressSearchFilter | null {
  if (Config.geolocation.filterSearchByDefault) {
    const geoRegionLongName = regionLongNameMap[geo.region]

    if (!geoRegionLongName) {
      return null
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

  return givenAddress || null
}
