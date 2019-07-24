import React, { useContext } from 'react'
import { DropdownContext } from './DropdownWithContext'

// tslint:disable-next-line:no-empty-interface
interface DropdownTogglerProps {}

const DropdownToggler: React.FC<DropdownTogglerProps> = ({ children }) => {
  const context = useContext(DropdownContext)

  return React.cloneElement(
    React.Children.only(children) as React.ReactElement,
    {
      onClick: event => {
        if (event) {
          event.preventDefault()
        }

        if (context) {
          context.toggle()
        }
      },
    },
  )
}

DropdownToggler.displayName = 'DropdownToggler'

export default DropdownToggler
