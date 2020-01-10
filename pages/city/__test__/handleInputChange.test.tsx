import handleInputChange from '~/pages/city/handleInputChange'

it('works correctly', () => {
  const router: any = {
    pathname: '/cidades/[cityName]',
    push: jest.fn(),
  }
  const cityName: string = 'São Paulo'
  const skill: string = '1'
  const cause: string = '1'
  const event: any = {
    target: {
      name: 'foo event',
      value: 'foo value',
    },
  }

  handleInputChange(router, cityName, skill, cause)(event)

  expect(router.push).toBeCalledWith({
    pathname: '/cidades/São Paulo',
    query: { cause: '1', 'foo event': 'foo value', skill: '1' },
  })
})
