import { renderHook } from '@testing-library/react-hooks'
import useSkills from '../use-skills'
import { swrFetcher } from '../fetch/swrFetcher'

jest.mock('../fetch/swrFetcher', () => ({
  swrFetcher: jest.fn(),
}))

const fetch = swrFetcher as any
describe('useCauses', () => {
  it('should be return correct data', async () => {
    fetch.mockImplementation((url, options) => {
      return Promise.resolve({
        causes: [
          {
            id: 1,
            name: 'Treinamento Profissional',
            slug: 'treinamento-profissional',
            image: 'foo_img_src',
          },
          {
            id: 2,
            name: 'Combate à Pobreza',
            slug: 'combate-a-pobreza',
            image: 'foo_img_src',
          },
        ],
        skills: [
          {
            id: 1,
            name: 'Artes/Trabalho manual',
            slug: 'artes-trabalho-manual',
          },
          { id: 2, name: 'Comunicação', slug: 'comunicacao' },
        ],
        volunteer_count: 123,
        nonprofit_count: 123,
      })
    })
    const { result, waitForNextUpdate } = renderHook(() => useSkills())

    expect(result.current.skills).toEqual(undefined)
    expect(result.current.error).toEqual(undefined)
    expect(result.current.loading).toEqual(true)

    await waitForNextUpdate()

    expect(result.current.skills).toEqual([
      {
        id: 1,
        name: 'Artes/Trabalho manual',
        slug: 'artes-trabalho-manual',
      },
      { id: 2, name: 'Comunicação', slug: 'comunicacao' },
    ])
    expect(result.current.error).toEqual(undefined)
    expect(result.current.loading).toEqual(false)
  })
})
