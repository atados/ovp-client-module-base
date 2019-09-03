import { useIntl } from 'react-intl'

export default function withIntl<Props>(
  Component: React.ComponentType<Props>,
): React.FC<Props> {
  return props => {
    const intl = useIntl()
    return <Component {...(props as Props)} intl={intl} />
  }
}
