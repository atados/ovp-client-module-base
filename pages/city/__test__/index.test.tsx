import React from 'react'
import renderer from 'react-test-renderer'

import Index from '..'

jest.mock('~/components/Layout', () => props => (
  <div {...props}>~/components/Layout - {props.children}</div>
))

jest.mock('react-intl', () => ({
  FormattedMessage: props => <div {...props}>FormattedMessage</div>,
}))

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

it('renders correctly', () => {
  const tree = renderer.create(<Index cityName="Sao Paulo" />).toJSON()
  expect(tree).toMatchSnapshot()
})
