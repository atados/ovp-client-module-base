import { renderHook, RenderHookOptions } from '@testing-library/react-hooks'
import { Provider } from 'react-redux'
import { Store } from 'redux'

import { configureStore } from '~/redux/with-redux'

interface CreateProvidersWrapperConfig {
  store: Store
}

const createProvidersWrapper = ({ store }: CreateProvidersWrapperConfig) => ({
  children,
}) => {
  return <Provider store={store}>{children}</Provider>
}

const renderHookWithProviders = <P, R>(
  fn: (props: P) => R,
  {
    store = configureStore({ startup: undefined }),
    ...options
  }: Partial<CreateProvidersWrapperConfig> & RenderHookOptions<P> = {},
) =>
  renderHook<P, R>(fn, {
    ...options,
    wrapper: createProvidersWrapper({ store }),
  })

export default renderHookWithProviders
