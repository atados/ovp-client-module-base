import 'jest-styled-components'

// @ts-ignore
jest.mock('~/components/Meta', () => () => null)
jest.mock('react-intl', () => ({
  FormattedMessage: () => 'FormattedMessage',
  defineMessages: shape => shape,
  useIntl: () => ({
    formatMessage: jest.fn().mockImplementation(() => '<intl-message>'),
  }),
}))
jest.mock('~/components/Toasts', () => ({
  useToasts: () => ({
    add: jest.fn().mockImplementation(() => '<toast-id>'),
    replace: jest.fn(),
    remove: jest.fn(),
  }),
}))
