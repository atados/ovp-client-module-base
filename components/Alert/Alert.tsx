import React, { useState } from 'react'
import Icon from '~/components/Icon'

interface AlertProps {
  children: React.ReactNode
  backgroundColor?: string
  onClose?: Function
}

const Alert: React.FC<AlertProps> = ({
  children,
  backgroundColor,
  onClose,
}) => {
  const [open, setOpen] = useState<boolean>(true)
  const handleClick = () => {
    if (onClose) onClose()
    setOpen(false)
  }

  if (open) {
    return (
      <div
        className="w-full min-h-4 flex justify-center items-center py-2 px-4"
        style={{
          backgroundColor,
          padding: '10px 20px',
        }}
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

  return null
}

Alert.defaultProps = {
  backgroundColor: '#FFC671',
}

export default Alert
