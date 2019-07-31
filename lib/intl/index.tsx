import { InjectedIntlProps } from 'react-intl'
import useIntl from '~/hooks/use-intl'

export function withIntl<Props extends InjectedIntlProps>(
  Component: React.ComponentType<Props>,
): React.FC<Omit<Props, keyof InjectedIntlProps>> {
  return props => {
    const intl = useIntl()
    return <Component {...props as Props} intl={intl} />
  }
}
