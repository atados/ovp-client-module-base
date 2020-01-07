import React from 'react'
import { connect } from 'react-redux'
import Authentication from '~/components/Authentication'
import FormComposerLayout from '~/components/FormComposer/FormComposerLayout'
import { RootState } from '~/redux/root-reducer'
import { defineMessages, WithIntlProps } from 'react-intl'
import { withIntl } from '~/lib/intl'

interface OrganizationComposerAuthProps {
  isAuthenticated: boolean
  onSubmit: () => any
}

const { ETAPA1, ACESSO, CRIE_CONTA } = defineMessages({
  ETAPA1: {
    id: 'ETAPA1',
    defaultMessage: 'ETAPA 1',
  },
  ACESSO: {
    id: 'ACESSO',
    defaultMessage: 'Acesso',
  },
  CRIE_CONTA: {
    id: 'CRIE_CONTA',
    defaultMessage: 'Crie uma conta de usuário pra poder registrar sua ONG',
  },
})

class OrganizationComposerAuth extends React.Component<
  OrganizationComposerAuthProps & WithIntlProps<any>
> {
  public componentDidMount() {
    const { isAuthenticated, onSubmit } = this.props

    if (isAuthenticated) {
      onSubmit()
    }
  }

  public render() {
    const { intl, onSubmit } = this.props
    return (
      <FormComposerLayout disabled formProps={{ as: 'div' }}>
        <h4 className="text-gray-600 text-sm">{intl.formatMessage(ETAPA1)}</h4>
        <h1 className="font-light mb-1">{intl.formatMessage(ACESSO)}</h1>
        <p className="text-lg text-gray-700 mb-6">
          {intl.formatMessage(CRIE_CONTA)}
        </p>
        <Authentication onAuthenticate={onSubmit} />
      </FormComposerLayout>
    )
  }
}

const mapStateToProps = ({ user }: RootState) => ({
  isAuthenticated: Boolean(user),
})
export default connect(mapStateToProps)(withIntl(OrganizationComposerAuth))
