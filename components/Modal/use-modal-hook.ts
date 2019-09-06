import { useCallback, useContext, useEffect } from 'react'
import { ModalContext, ModalOptions } from './ModalProvider'
import { useRouter } from 'next/router'

interface UseModalOptions<Props> extends ModalOptions<Props> {
  readonly id?: string
  readonly component?: React.ComponentType<any>
  readonly skip?: boolean
  readonly onClosePropName?: string
}

export default function useModal<Props>({
  id,
  component,
  skip,
  onClosePropName = 'onClose',
  ...options
}: UseModalOptions<Props>) {
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

      if (modalManager.isModalOpen(id)) {
        return
      }

      const close = () => {
        modalManager.close(id)
      }

      modalManager!.push(id!, component!, {
        ...options,
        ...overrideOptions,
        componentProps: options
          ? { ...options.componentProps, [onClosePropName]: close, ...props }
          : props,
      })
    },
    [component, modalManager.push],
  )

  return fn
}
