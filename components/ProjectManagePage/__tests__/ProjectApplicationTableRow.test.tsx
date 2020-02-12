import ProjectApplicationTableRow from '../ProjectApplicationTableRow'
import { render, fireEvent, wait } from '@testing-library/react'
import * as legacyFetchHooks from '~/hooks/use-fetch'
import renderer from 'react-test-renderer'

jest.mock('isomorphic-unfetch', () => jest.fn())
jest.mock('~/hooks/use-fetch', () => ({
  useAPIFetcher: jest.fn().mockImplementation(() => ({
    fetch: jest.fn(),
  })),
  mutateFetchCache: jest.fn(),
}))

const useAPIFetcher = (legacyFetchHooks.useAPIFetcher as any) as jest.Mock<
  typeof legacyFetchHooks['useAPIFetcher']
>
describe('ProjectApplicationTableRow', () => {
  beforeEach(() => useAPIFetcher.mockClear())

  it('should match snapshot', () => {
    const tree = renderer
      .create(
        <table>
          <tbody>
            <ProjectApplicationTableRow
              projectSlug="slug"
              application={{
                status: 'applied',
                canceled: false,
                date: String(Date.now()),
                id: 1,
              }}
            />
          </tbody>
        </table>,
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should confirm an application when the confirm button is clicked', async () => {
    const handleConfirm = jest.fn()
    const { getByRole } = render(
      <table>
        <tbody>
          <ProjectApplicationTableRow
            projectSlug="slug"
            application={{
              status: 'applied',
              canceled: false,
              date: String(Date.now()),
              id: 1,
            }}
            onConfirm={handleConfirm}
          />
        </tbody>
      </table>,
    )

    const [{ value: fetchHook }] = useAPIFetcher.mock.results
    fireEvent.click(getByRole('confirm-application'))
    await wait()
    const [actionCreator] = useAPIFetcher.mock.calls[0]
    expect(actionCreator('confirmed-volunteer')).toMatchObject({
      method: 'PATCH',
      endpoint: '/projects/slug/applies/1/',
      meta: {
        to: 'confirmed-volunteer',
      },
    })
    expect(fetchHook.fetch).toBeCalledWith('confirmed-volunteer')
    expect(handleConfirm).toBeCalledTimes(1)
  })

  it('should not allow an application to be confirmed when it already is', async () => {
    const handleConfirm = jest.fn()
    const { queryByRole } = render(
      <table>
        <tbody>
          <ProjectApplicationTableRow
            projectSlug="slug"
            application={{
              status: 'confirmed-volunteer',
              canceled: false,
              date: String(Date.now()),
              id: 1,
            }}
            onConfirm={handleConfirm}
          />
        </tbody>
      </table>,
    )

    const [{ value: fetchHook }] = useAPIFetcher.mock.results
    expect(queryByRole('confirm-application')).toBeNull()
    expect(fetchHook.fetch).toBeCalledTimes(0)
    expect(handleConfirm).toBeCalledTimes(0)
  })

  it('should remove an application if the button is clicked', async () => {
    const handleRemoval = jest.fn()
    const { getByRole } = render(
      <table>
        <tbody>
          <ProjectApplicationTableRow
            projectSlug="slug"
            application={{
              status: 'confirmed-volunteer',
              canceled: false,
              date: String(Date.now()),
              id: 1,
            }}
            onRemove={handleRemoval}
          />
        </tbody>
      </table>,
    )

    const [{ value: fetchHook }] = useAPIFetcher.mock.results
    fireEvent.click(getByRole('remove-application'))
    await wait()
    const [actionCreator] = useAPIFetcher.mock.calls[0]
    expect(actionCreator('unapplied-by-deactivation')).toMatchObject({
      method: 'PATCH',
      endpoint: '/projects/slug/applies/1/',
      meta: {
        to: 'unapplied-by-deactivation',
      },
    })
    expect(fetchHook.fetch).toBeCalledWith('unapplied-by-deactivation')
    expect(handleRemoval).toBeCalledTimes(1)
  })
})
