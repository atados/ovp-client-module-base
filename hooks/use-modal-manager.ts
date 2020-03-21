import { dev } from '~/common/constants'
import { useModals } from '~/components/Modal/hooks'

export default () => {
  if (dev) {
    console.warn(`useModalManager was deprecated. Use useModals instead`)
  }

  return useModals()
}
