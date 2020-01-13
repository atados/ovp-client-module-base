export const mountAPIPathToSearchProjects = (
  cityName: string,
  selectedCause?: string,
  selectedSkill?: string,
): string => {
  const basePath: string = '/search/projects/?address='
  const address: string = JSON.stringify({
    description: cityName,
    address_components: [
      {
        types: ['administrative_area_level_1'],
        long_name: cityName,
      },
    ],
  })
  const cause: string = selectedCause ? `&cause=${selectedCause}` : ''
  const skill: string = selectedSkill ? `&skill=${selectedSkill}` : ''

  return basePath + address + cause + skill
}
