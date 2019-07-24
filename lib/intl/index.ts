import hoistNonReactStatics from 'hoist-non-react-statics'
import { injectIntl } from 'react-intl'

export const hoistStatics = <T = any>(
  higherOrderComponent: (
    BaseComponent: React.ComponentType<T>,
  ) => React.ComponentType<T>,
) => (BaseComponent: React.ComponentType<T>) => {
  const NewComponent = higherOrderComponent(BaseComponent)
  hoistNonReactStatics(NewComponent, BaseComponent)

  return NewComponent
}

// @ts-ignore
export const withIntl = hoistStatics(injectIntl)
