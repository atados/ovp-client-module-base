import React, { useState } from 'react'
import Icon from '~/components/Icon'

interface AlertProps {
  children: React.ReactNode
  bgClassName?: string
  onClose?: Function
}

const Alert: React.FC<AlertProps> = ({ children, bgClassName, onClose }) => {
  const [open, setOpen] = useState<boolean>(true)
  const handleClick = () => {
    if (onClose) onClose()
    setOpen(false)
  }

  if (!open) {
    return null
  }

  return (
    <div
      className={`w-full min-h-4 flex justify-center items-center py-2 px-4 bg-orange-400 ${bgClassName}`}
    >
      {children}
      <button
        role="close"
        onClick={handleClick}
        className="absolute right-0 mr-2 cursor-pointer"
      >
        <Icon name="close" />
      </button>
    </div>
  )
}

Alert.defaultProps = {
  bgClassName: 'bg-orange-400',
}

export default Alert
