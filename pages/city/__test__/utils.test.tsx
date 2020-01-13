import { mountAPIPathToSearchProjects } from '~/pages/city/utils'

describe('City Page Utils', () => {
  it('should mount the api path to search projects correctly', () => {
    const cityName: string = 'São Paulo'
    const selectedCause: string = '123'
    const selectedSkill: string = '321'

    const response = mountAPIPathToSearchProjects(
      cityName,
      selectedCause,
      selectedSkill,
    )

    expect(response).toBe(
      '/search/projects/?address={"description":"São Paulo","address_components":[{"types":["administrative_area_level_1"],"long_name":"São Paulo"}]}&cause=123&skill=321',
    )
  })
})
