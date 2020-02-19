import React, { useState, useRef } from 'react'
import cx from 'classnames'
import { ToastType } from '.'
import Icon, { MaterialIconName } from '../Icon/Icon'
import ActivityIndicator from '~/components/ActivityIndicator'
import { useDrag } from 'react-use-gesture'
import styled from 'styled-components'

const IconWrapper = styled.span`
  line-height: 1.2;

  &.text-sm > .icon {
    margin-top: 2px;
  }
`

const ActivityIndicatorStyled = styled(ActivityIndicator)`
  margin-left: -10px !important;
  margin-top: -15px !important;
`

interface ToastProps {
  readonly message: React.ReactNode | string
  readonly type: ToastType
  readonly enableRemoveButton?: boolean
  readonly onRemove?: (exitClassName?: string) => void
  readonly useAnimations?: boolean
  readonly className?: string
}

const typeToIconNameMap: {
  [key in Exclude<ToastType, 'loading'>]: MaterialIconName
} = {
  error: 'close',
  success: 'check',
  warning: 'warning',
  info: 'email',
}
const typeToClassNameMap: { [key in Exclude<ToastType, 'loading'>]: string } = {
  error: 'border-red-500 text-red-500 text-lg',
  success: 'border-green-500 text-green-500 text-lg leading-normal',
  warning: 'border-yellow-500 text-yellow-500 text-sm',
  info: 'border-white-500 text-white text-sm',
}

const Toast: React.FC<ToastProps> = ({
  className,
  message,
  type,
  enableRemoveButton,
  onRemove,
}) => {
  const removedRef = useRef(false)
  const lastXRef = useRef(0)
  const [x, setX] = useState(0)
  const bindDrag = useDrag(e => {
    if (removedRef.current) {
      return
    }
    lastXRef.current = x

    if (e.dragging) {
      setX(prevX => prevX + e.delta[0])
    } else {
      setX(0)
      return
    }

    if (Math.abs(x) > 100 && onRemove) {
      removedRef.current = true
      onRemove(x < 0 ? 'fadeOutLeft' : x > 0 ? 'fadeOutRight' : undefined)
    }
  })

  return (
    <div
      {...bindDrag()}
      role="toast"
      className={cx(
        className,
        'bg-white bg-gray-800 rounded-full shadow text-gray-200 h-10 inline-block max-w-full relative',
        enableRemoveButton && 'pr-2',
      )}
      style={{
        left: `${x}px`,
        zIndex: 10000,
        transition:
          Math.abs(lastXRef.current) > 5 && x === 0 ? 'left .2s' : undefined,
      }}
    >
      <div
        className={`py-2 pl-2 relative truncate ${
          enableRemoveButton ? 'pr-6' : 'pr-4'
        }`}
      >
        {type === 'loading' ? (
          <ActivityIndicatorStyled
            size={42}
            fill="#fff"
            className="inline-block align-middle mr-0"
          />
        ) : (
          <IconWrapper
            className={`${typeToClassNameMap[type]} border-2 w-6 h-6 rounded-full inline-block mr-2 text-center align-top`}
          >
            <Icon name={typeToIconNameMap[type]} className="leading-none" />
          </IconWrapper>
        )}
        <span className="leading-relaxed">{message}</span>
        {enableRemoveButton && (
          <button
            type="button"
            className="w-6 h-6 rounded-full ml-1 absolute right-0 top-0 bottom-0 my-auto"
            onClick={() => onRemove && onRemove()}
            role="remove-toast"
          >
            <Icon name="close" />
          </button>
        )}
      </div>
    </div>
  )
}

Toast.displayName = 'Toast'

export default Toast
