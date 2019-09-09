import React from 'react'
import { connect } from 'react-redux'
import Authentication from '~/components/Authentication'
import FormComposerLayout from '~/components/FormComposer/FormComposerLayout'
import { RootState } from '~/redux/root-reducer'
import { defineMessages, InjectedIntlProps } from 'react-intl'
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
    defaultMessage: 'ou arraste pra cá',
  },
  CRIE_CONTA: {
    id: 'CRIE_CONTA',
    defaultMessage: 'Crie uma conta de usuário pra poder registrar sua ONG',
  },
})

class OrganizationComposerAuth extends React.Component<
  OrganizationComposerAuthProps
> {
  public componentDidMount() {
    const { isAuthenticated, onSubmit } = this.props

    if (isAuthenticated) {
      onSubmit()
    }
  }

  public render() {
    const { intl } = this.props
    return (
      <FormComposerLayout disabled>
        <h4 className="tc-muted ts-small">{intl.formatMessage(ETAPA1)}</h4>
        <h1 className="tw-light mb-1">{intl.formatMessage(ACESSO)}</h1>
        <p className="ts-medium tc-muted-dark mb-4">
          {intl.formatMessage(CRIE_CONTA)}
        </p>
        <Authentication
          defaultPath="/register"
          disableBackButton
          headerDisabled
          successRedirect="/sou-uma-ong/basics"
        />
      </FormComposerLayout>
    )
  }
}

const mapStateToProps = ({ user }: RootState) => ({
  isAuthenticated: Boolean(user),
})
export default connect(mapStateToProps)(withIntl(OrganizationComposerAuth))
