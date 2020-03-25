import useCauses from '../use-causes'

jest.mock('../use-startup-data', () => () => {
  return {
    data: {
      causes: ['cause_1', 'cause_2'],
      skills: ['skill_1', 'skill_2'],
      stats: {
        organizationsCount: 'nonprofit_count',
        volunteersCount: 'volunteer_count',
      },
    },
    loading: 'loading',
    error: 'error',
  }
})

jest.mock('react', () => ({
  useMemo: (func, params) => func(),
}))

describe('useCauses', () => {
  it('should be return correct data', () => {
    const { causes, error, loading } = useCauses()

    expect(causes).toEqual(['cause_1', 'cause_2'])
    expect(error).toEqual('error')
    expect(loading).toEqual('loading')
  })
})
