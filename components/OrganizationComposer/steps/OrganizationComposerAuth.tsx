import React from 'react'
import { connect } from 'react-redux'
import Authentication from '~/components/Authentication'
import FormComposerLayout from '~/components/FormComposer/FormComposerLayout'
import { RootState } from '~/redux/root-reducer'

interface OrganizationComposerAuthProps {
  isAuthenticated: boolean
  onSubmit: () => any
}

class OrganizationComposerAuth extends React.Component<
  OrganizationComposerAuthProps & InjectedIntlProps
> {
  public componentDidMount() {
    const { isAuthenticated, onSubmit } = this.props

    if (isAuthenticated) {
      onSubmit()
    }
  }

  public render() {
    return (
      <FormComposerLayout disabled>
        <h4 className="tc-muted ts-small">ETAPA 1</h4>
        <h1 className="tw-light mb-1">Acesso</h1>
        <p className="ts-medium tc-muted-dark mb-4">
          Crie uma conta de usuário pra poder registrar sua ONG
        </p>
        <Authentication />
      </FormComposerLayout>
    )
  }
}

const mapStateToProps = ({ user }: RootState) => ({
  isAuthenticated: Boolean(user),
})
export default connect(mapStateToProps)(OrganizationComposerAuth)
