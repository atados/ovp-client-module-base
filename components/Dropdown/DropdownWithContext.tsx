import React, { useCallback, useMemo, useState } from 'react'
import Dropdown, { DropdownProps } from './Dropdown'

export interface DropdownContextType {
  toggle: () => void
}
export const DropdownContext = React.createContext<DropdownContextType | null>(
  null,
)

// tslint:disable-next-line:no-empty-interface
interface DropdownWithContextProps extends DropdownProps {}

const DropdownWithContext: React.FC<DropdownWithContextProps> = ({
  defaultOpen,
  children,
  onOpenStateChange,
  ...props
}) => {
  const [open, setOpen] = useState<boolean>(Boolean(defaultOpen))
  const contextValue = useMemo(
    () => ({
      toggle: () => {
        setOpen(isCurrentOpen => {
          if (onOpenStateChange) {
            onOpenStateChange(!isCurrentOpen)
          }

          return !isCurrentOpen
        })
      },
    }),
    [setOpen, onOpenStateChange],
  )
  const handleOpenStateChange = useCallback((isOpen: boolean) => {
    if (onOpenStateChange) {
      onOpenStateChange(isOpen)
    }

    setOpen(isOpen)
  }, [])

  return (
    <DropdownContext.Provider value={contextValue}>
      <Dropdown
        {...props}
        open={open}
        onOpenStateChange={handleOpenStateChange}
      >
        {children}
      </Dropdown>
    </DropdownContext.Provider>
  )
}

DropdownWithContext.displayName = 'DropdownWithContext'

export default DropdownWithContext
