import { useCallback, useContext, useEffect, useRef } from 'react'
import { ModalContext, ModalOptions } from './ModalProvider'
import { useRouter } from 'next/router'

interface UseModalOptions<TProps> extends ModalOptions<TProps> {
  readonly id?: string
  readonly component?: React.ComponentType<any>
  readonly skip?: boolean
  readonly onClosePropName?: string
}

export default function useModal<Props>(
  allOptions: UseModalOptions<Partial<Props>>,
) {
  const {
    id,
    component,
    skip,
    onClosePropName = 'onClose',
    ...options
  } = allOptions
  const modalManager = useContext(ModalContext)

  if (!modalManager) {
    throw new Error('You must wrap the Root component with <ModalProvider>')
  }

  const router = useRouter()
  useEffect(() => {
    const onRouteChangeStart = () => {
      modalManager.close(id)
    }

    router.events.on('routeChangeStart', onRouteChangeStart)
    return () => router.events.off('routeChangeStart', onRouteChangeStart)
  }, [router])

  const closeModal = useCallback(() => {
    modalManager.close(id)
  }, [id])

  const lastUsedOptionsRef = useRef<ModalOptions<Partial<Props>>>(allOptions)
  useEffect(() => {
    if (id && component && modalManager.isModalOpen(id)) {
      modalManager.replace(id, component, id, lastUsedOptionsRef.current)
      return
    }
  }, [component])

  const fn = useCallback(
    (
      props?: Props,
      overrideOptions?: Omit<ModalOptions<any>, 'componentProps'>,
    ) => {
      if (!id || !component) {
        if (skip) {
          return
        }

        throw new Error(`Missing ${id ? 'component' : 'id'} in useModal`)
      }

      const modalOptions = {
        ...options,
        ...overrideOptions,
        componentProps: options
          ? {
              ...options.componentProps,
              [onClosePropName]: closeModal,
              ...props,
            }
          : props,
      }
      lastUsedOptionsRef.current = modalOptions

      if (modalManager.isModalOpen(id)) {
        modalManager.replace(id, component, id, modalOptions)
        return
      }

      modalManager.push(id!, component!, modalOptions)
    },
    [
      component,
      options.cardClassName,
      options.cardWrapperClassName,
      options.disableCloseButton,
      options.containerClassName,
      modalManager.push,
    ],
  )

  return fn
}
