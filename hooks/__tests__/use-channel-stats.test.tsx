import { renderHook } from '@testing-library/react-hooks'
import useChannelStats from '../use-channel-stats'
import { swrFetcher } from '../fetch/swrFetcher'

jest.mock('../fetch/swrFetcher', () => ({
  swrFetcher: jest.fn(),
}))

const swrFetcherMock = (swrFetcher as any) as jest.Mock<
  ReturnType<typeof swrFetcher>
>
describe('useCauses', () => {
  it('should be return correct data', async () => {
    swrFetcherMock.mockImplementation(() => {
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
    const { result, waitForNextUpdate } = renderHook(() => useChannelStats())

    expect(result.current.stats).toEqual(undefined)
    expect(result.current.error).toEqual(undefined)
    expect(result.current.loading).toEqual(true)

    await waitForNextUpdate()

    expect(result.current.stats).toEqual({
      organizationsCount: 123,
      volunteersCount: 123,
    })
    expect(result.current.error).toEqual(undefined)
    expect(result.current.loading).toEqual(false)
  })
})