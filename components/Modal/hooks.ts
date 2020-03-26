import { useMemo, useContext, useRef, useEffect } from 'react'
import nanoid from 'nanoid'
import {
  ModalContext,
  ModalConfig,
  ModalContextType,
} from '~/components/Modal/context'
import { dev } from '~/common/constants'

export interface UseModalOptions<Props>
  extends Partial<Omit<ModalConfig<Props>, 'component' | 'props'>> {
  component: React.ComponentType<Props>
  /**
   * @deprecated
   */
  componentProps?: any
  /**
   * @deprecated
   */
  cardClassName?: string
  onClosePropName?: string
}

export interface UseModalResult<Props> {
  (props?: Props): string
  id: string
  open: (props?: Props) => string
  close: () => void
}

export const useModal = <Props>({
  id: givenId,
  component,
  label,
  className,
  cardClassName: deprecatedCardClassName,
  componentProps: deprectedComponentProps,
  onClosePropName: deprecatedOnClosePropName,
}: UseModalOptions<Props>): UseModalResult<Props> => {
  const modals = useModals()
  const id = useMemo(() => givenId || nanoid(), [givenId])

  if (dev && deprectedComponentProps) {
    console.warn(
      'useModal with componentProps will be deprecated. Pass props at the open call',
    )
  }

  useEffect(() => {
    const lastModal = modals.get(id)
    if (lastModal) {
      modals.replace(id, {
        ...lastModal,
        component,
      })
    }
  }, [component])

  return useMemo(() => {
    const modal: UseModalResult<Props> = ((props?: Props) => {
      if (dev && !props) {
        console.warn(
          `Modal with id ${id} was open without passing props. This will be deprecated`,
        )
      }

      const passedProps = deprectedComponentProps
        ? { ...deprectedComponentProps, ...props }
        : { ...props }

      if (deprecatedOnClosePropName) {
        if (dev) {
          console.warn(
            `onClosePropName option on useModal will be deprecated. Pass it as a prop with \`modal.open({ onClose: () => modal.close() })\``,
          )
        }
      }

      const config: ModalConfig<Props> = {
        id,
        component,
        props: passedProps,
        className: className || deprecatedCardClassName,
        label,
      }

      if (modals.isOpen(id)) {
        return modals.replace(id, config)
      }

      return modals.push(config)
    }) as UseModalResult<Props>

    modal.id = id
    modal.open = props => modal(props)
    modal.close = () => {
      return modals.close(id)
    }

    return modal
  }, [component, id, label])
}

export const useModals = (): ModalContextType => {
  const modalManager = useContext(ModalContext)
  if (!modalManager) {
    throw new Error(
      'ModalContext could not be consumed. Be sure to wrap the app with ModalProvider.',
    )
  }

  return modalManager
}
