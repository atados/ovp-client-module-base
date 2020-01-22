import React from 'react'
import renderer from 'react-test-renderer'
import { RouterContext } from 'next/dist/next-server/lib/router-context'
import CityPage from '..'
import { render, fireEvent, wait } from '@testing-library/react'

jest.mock('~/components/Layout', () => props => <div>{props.children}</div>)

jest.mock('react-redux', () => ({
  useSelector: () => ({
    causes: [
      { id: 1, name: 'cause1' },
      { id: 2, name: 'cause2' },
    ],
    skills: [
      { id: 1, name: 'skill1' },
      { id: 2, name: 'skill2' },
    ],
  }),
}))

jest.mock('~/hooks/use-fetch-api', () => () => ({
  data: {
    results: [
      {
        id: 1,
        name: 'Project 1',
        slug: 'project_1',
      },
      {
        id: 2,
        name: 'Project 2',
        slug: 'project_2',
      },
    ],
  },
}))

jest.mock('~/components/ProjectCard', () => props => (
  <div {...props}>~/components/ProjectCard - {props.children}</div>
))

describe('City Page', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<CityPage cityName="Sao Paulo" />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('change the route when the filters change', async () => {
    const router: any = {
      pathname: '/cidades/[cityName]',
      push: jest.fn(),
    }
    const { getByRole } = render(
      <RouterContext.Provider value={router}>
        <CityPage cityName="São Paulo" selectedSkillId="2" />
      </RouterContext.Provider>,
    )
    fireEvent.change(getByRole('cause-filter'), {
      target: { name: 'cause', value: '1' },
    })
    await wait()
    expect(router.push).toBeCalledWith({
      pathname: '/cidades/São Paulo',
      query: { cause: '1', skill: '2' },
    })
  })

  it('extract initial props correctly', async () => {
    expect(
      await CityPage.getInitialProps!({
        query: {
          cityName: 'SP',
          cause: 1,
        },
      } as any),
    ).toMatchObject({
      cityName: 'SP',
      selectedCauseId: '1',
    })
    expect(
      await CityPage.getInitialProps!({
        query: {
          cityName: 'SP',
          skill: 1,
        },
      } as any),
    ).toMatchObject({
      cityName: 'SP',
      selectedSkillId: '1',
    })
    expect(
      await CityPage.getInitialProps!({
        query: {
          cityName: 'SP',
          cause: 1,
          skill: 1,
        },
      } as any),
    ).toMatchObject({
      cityName: 'SP',
      selectedCauseId: '1',
      selectedSkillId: '1',
    })
  })
})
