import React from 'react'
import renderer from 'react-test-renderer'
import { render, fireEvent } from '@testing-library/react'
import EmailConfirmationAlert from '../EmailConfirmationAlert'
import moment from 'moment'

jest.mock('~/hooks/use-fetch-api-mutation', () => () => ({
  mutate: jest.fn(),
  loading: false,
  data: {
    success: false,
  },
}))

jest.mock('~/common', () => ({
  Config: {
    emailConfirmation: {
      warning: true,
    },
  },
}))

afterEach(() => {
  localStorage.clear()
})

describe('EmailConfirmationAlert', () => {
  const user = {
    uuid: '123456789',
    email: 'foo@bar.com',
    is_email_verified: false,
  }

  it('renders correctly', () => {
    localStorage.setItem(
      'hiddenEmailConfirmation',
      JSON.stringify({
        userUuid: user.uuid,
        expirationDate: moment()
          .subtract(1, 'week')
          .format(),
      }),
    )

    const renderedComponent = renderer.create(
      <EmailConfirmationAlert user={user} />,
    )
    renderedComponent.update(<EmailConfirmationAlert user={user} />)
    const tree = renderedComponent.toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('should send email and set hiddenEmailConfirmation on localstorage when button is pressed', () => {
    const root = render(<EmailConfirmationAlert user={user} />)

    fireEvent.click(root.getByRole('send-confirmation-email'))

    expect(
      JSON.parse(localStorage.getItem('hiddenEmailConfirmation') as string)
        .userUuid,
    ).toBe('123456789')
  })
})
