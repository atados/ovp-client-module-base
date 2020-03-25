import { renderHook } from '@testing-library/react-hooks'
import useStartupData from '../use-startup-data'
import { swrFetcher } from '../fetch/swrFetcher'

jest.mock('../fetch/swrFetcher', () => ({
  swrFetcher: jest.fn(),
}))

const fetch = swrFetcher as any
describe('useStartupData', () => {
  it('should be return correct data', async () => {
    fetch.mockImplementation(() => {
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
    const { result, waitForNextUpdate } = renderHook(() => useStartupData())

    expect(result.current.data).toEqual(undefined)
    expect(result.current.error).toEqual(undefined)
    expect(result.current.loading).toEqual(true)

    await waitForNextUpdate()

    expect(result.current.data).toEqual({
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
      stats: { organizationsCount: 123, volunteersCount: 123 },
    })
    expect(result.current.error).toEqual(undefined)
    expect(result.current.loading).toEqual(false)
  })
})
