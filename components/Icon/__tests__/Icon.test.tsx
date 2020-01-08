import { render } from '@testing-library/react'
import Icon from '../Icon'

describe('Components', () => {
  describe('Icon', () => {
    test('it should render without error', () => {
      const { getByText } = render(<Icon name="access_time" />)

      expect(getByText('access_time')).toBeTruthy()
    })
  })
})
