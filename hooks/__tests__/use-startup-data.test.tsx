import renderHookWithProviders from '~/hooks/renderHookWithProviders'
import { configureStore } from '~/redux/with-redux'
import { getStartupData } from '~/lib/startup'

import useStartupData from '../use-startup-data'

jest.mock('~/lib/startup', () => ({
  getStartupData: jest.fn(),
}))

const getStartupDataMock = (getStartupData as any) as jest.Mock<
  ReturnType<typeof getStartupData>
>

describe('useStartupData', () => {
  it('should be return correct data', async () => {
    getStartupDataMock.mockImplementation(() => {
      return Promise.resolve({
        causes: [
          {
            id: 1,
            name: 'Treinamento Profissional',
            slug: 'treinamento-profissional',
            image: undefined,
            color: 'pink',
          },
          {
            id: 2,
            name: 'Combate à Pobreza',
            slug: 'combate-a-pobreza',
            image: undefined,
            color: 'pink',
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
        stats: {
          volunteers: 123,
          organizations: 123,
        },
      })
    })

    const store = configureStore({ startup: undefined })
    const { result, waitForNextUpdate } = renderHookWithProviders(
      () => useStartupData(),
      { store },
    )

    expect(getStartupDataMock).toHaveBeenCalled()
    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toEqual(true)
    expect(window.fetchAndDispatchStartupPromise).toBeTruthy()

    await waitForNextUpdate()

    expect(result.current.data).toEqual({
      causes: [
        {
          id: 1,
          name: 'Treinamento Profissional',
          slug: 'treinamento-profissional',
          image: undefined,
          color: 'pink',
        },
        {
          id: 2,
          name: 'Combate à Pobreza',
          slug: 'combate-a-pobreza',
          image: undefined,
          color: 'pink',
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
      stats: { volunteersCount: 123, organizationsCount: 123 },
    })
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBeFalsy()
  })

  it('should return correct data from redux without calling the API', async () => {
    getStartupDataMock.mockReset()

    const store = configureStore({
      startup: {
        causes: [
          {
            id: 1,
            name: 'Treinamento Profissional',
            slug: 'treinamento-profissional',
            image: undefined,
            color: 'pink',
          },
          {
            id: 2,
            name: 'Combate à Pobreza',
            slug: 'combate-a-pobreza',
            image: undefined,
            color: 'pink',
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
        stats: {
          volunteers: 123,
          organizations: 123,
        },
      },
    })
    const { result } = renderHookWithProviders(() => useStartupData(), {
      store,
    })

    expect(getStartupDataMock).not.toHaveBeenCalled()
    expect(result.current.data).toEqual({
      causes: [
        {
          id: 1,
          name: 'Treinamento Profissional',
          slug: 'treinamento-profissional',
          image: undefined,
          color: 'pink',
        },
        {
          id: 2,
          name: 'Combate à Pobreza',
          slug: 'combate-a-pobreza',
          image: undefined,
          color: 'pink',
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
      stats: { volunteersCount: 123, organizationsCount: 123 },
    })
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBeFalsy()
  })
})
