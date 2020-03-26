import { renderHook } from '@testing-library/react-hooks'
import useCauses from '../use-causes'
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
    const { result, waitForNextUpdate } = renderHook(() => useCauses())

    expect(result.current.causes).toEqual(undefined)
    expect(result.current.error).toEqual(undefined)
    expect(result.current.loading).toEqual(true)

    await waitForNextUpdate()

    expect(result.current.causes).toEqual([
      {
        id: 1,
        image: 'foo_img_src',
        name: 'Treinamento Profissional',
        slug: 'treinamento-profissional',
      },
      {
        id: 2,
        image: 'foo_img_src',
        name: 'Combate à Pobreza',
        slug: 'combate-a-pobreza',
      },
    ])
    expect(result.current.error).toEqual(undefined)
    expect(result.current.loading).toEqual(false)
  })
})
