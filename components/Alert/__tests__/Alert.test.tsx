import React from 'react'
import renderer from 'react-test-renderer'

import Alert from '..'
import { render, fireEvent } from '@testing-library/react'

describe('Alert', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Alert>foo</Alert>).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should call onClose prop', () => {
    const testClose = jest.fn()
    const root = render(<Alert onClose={testClose}>foo</Alert>)

    fireEvent.click(root.getByRole('close'))

    expect(testClose).toHaveBeenCalled()
  })
})
