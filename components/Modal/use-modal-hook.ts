import { useCallback, useContext, useEffect } from 'react'
import { ModalContext, ModalOptions } from './ModalProvider'
import { useRouter } from 'next/router'

interface UseModalOptions<TProps> extends ModalOptions<TProps> {
  readonly id?: string
  readonly component?: React.ComponentType<any>
  readonly skip?: boolean
  readonly onClosePropName?: string
}

// export type UseModalHook<TProps, TDefaultProps extends Partial<TProps>> = (
//   options: UseModalOptions<TDefaultProps>,
// ) => (props: PartialBy<TProps, keyof TDefaultProps>) => void

export default function useModal<Props>({
  id,
  component,
  skip,
  onClosePropName = 'onClose',
  ...options
}: UseModalOptions<Partial<Props>>) {
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

      const modalOptions = {
        ...options,
        ...overrideOptions,
        componentProps: options
          ? {
              ...options.componentProps,
              [onClosePropName]: () => {
                modalManager.close(id)
              },
              ...props,
            }
          : props,
      }

      if (modalManager.isModalOpen(id)) {
        modalManager.replace(id, component, id, modalOptions)
        return
      }

      modalManager!.push(id!, component!, modalOptions)
    },
    [component, modalManager.push],
  )

  return fn
}
