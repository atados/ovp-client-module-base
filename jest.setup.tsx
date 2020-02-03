import 'jest-styled-components'

// @ts-ignore
jest.mock('~/components/Meta', () => () => null)
jest.mock('react-intl', () => ({
  FormattedMessage: () => 'FormattedMessage',
  defineMessages: shape => shape,
}))
