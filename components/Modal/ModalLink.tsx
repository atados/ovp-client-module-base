import React from 'react'
import useModal from './use-modal-hook'

interface ModalLinkProps<Props> {
  readonly className?: string
  readonly cardClassName?: string
  readonly id: string
  readonly component: React.ComponentType<Props>
  readonly children: React.ReactNode
  readonly componentProps?: Props
}

const ModalLink: React.FC<ModalLinkProps<any>> = ({
  id,
  component,
  componentProps,
  cardClassName,
  children,
}) => {
  const openModal = useModal({
    id,
    component,
    componentProps,
    cardClassName,
  })

  return React.cloneElement(
    React.Children.only(children) as React.ReactElement,
    {
      onClick: event => {
        event.preventDefault()
        if (openModal) {
          openModal()
        }
      },
    },
  )
}

ModalLink.displayName = 'ModalLink'
ModalLink.defaultProps = {
  className: undefined,
}

export default ModalLink
