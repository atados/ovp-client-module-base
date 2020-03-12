import { useIntl } from 'react-intl'

export function withIntl<Props>(
  Component: React.ComponentType<Props>,
): React.FC<Props> {
  const Wrapper = props => {
    const intl = useIntl()
    return <Component {...(props as Props)} intl={intl} />
  }

  // @ts-ignore
  if (Component.getInitialProps) {
    // @ts-ignore
    Wrapper.getInitialProps = Component.getInitialProps
  }

  return Wrapper
}
