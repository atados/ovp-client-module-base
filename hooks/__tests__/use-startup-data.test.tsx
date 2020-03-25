import useStartupData from '../use-startup-data'

jest.mock('../use-api-fetch', () => ({
  useAPIFetch: () => {
    return {
      data: {
        causes: ['cause_1', 'cause_2'],
        skills: ['skill_1', 'skill_2'],
        volunteer_count: 'volunteer_count',
        nonprofit_count: 'nonprofit_count',
      },
      loading: 'loading',
      error: 'error',
    }
  },
}))

describe('useStartupData', () => {
  it('should be return correct data', async () => {
    const { data, error, loading } = useStartupData()

    expect(data).toEqual({
      causes: ['cause_1', 'cause_2'],
      skills: ['skill_1', 'skill_2'],
      stats: {
        organizationsCount: 'nonprofit_count',
        volunteersCount: 'volunteer_count',
      },
    })
    expect(error).toEqual('error')
    expect(loading).toEqual('loading')
  })
})
