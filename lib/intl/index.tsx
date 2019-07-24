import useIntl from '~/hooks/use-intl'
import { InjectedIntlProps } from 'react-intl'

export function withIntl<Props extends InjectedIntlProps>(
  Component: React.ComponentType<Props>,
): React.FC<Omit<Props, keyof InjectedIntlProps>> {
  return props => {
    const intl = useIntl()
    return <Component {...(props as Props)} intl={intl} />
  }
}
