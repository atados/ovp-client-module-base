import Link from 'next/link'
import * as React from 'react'
import { resolvePage } from '~/common/page'
import FormComposerLayout from '~/components/FormComposer/FormComposerLayout'
import HelpCard from '~/components/HelpCard'
import { Organization } from '~/redux/ducks/organization'

interface OrganizationComposerConclusionProps {
  readonly formContext?: { organization: Organization }
}

const OrganizationComposerConclusion: React.SFC<
  OrganizationComposerConclusionProps
> = ({ formContext }) => (
  <FormComposerLayout
    helpPanelChildren={
      <div className="p-5">
        <HelpCard className="card pr-4 pb-4 pl-4 pt-2">
          <h4 className="ts-medium tw-medium">
            Se comunique com os voluntários!
          </h4>
          <p className="tc-muted-dark mb-0">
            É muito importante que você se comunique com os voluntários após que
            receber inscrições em suas vagas.
          </p>
        </HelpCard>
      </div>
    }
  >
    <h4 className="tc-muted ts-small">REVISÃO</h4>
    <h1 className="tw-light mb-1">ONG registrada!</h1>
    <p className="ts-medium tc-muted-dark mb-4">
      Nossa equipe irá analisar o cadastro e aprová-lo o mais rápido possível.
      Fique atento ao seu email.
      <br /> <br />
      Mas você já pode acessar a página da sua ONG
      {formContext && formContext.organization && (
        <div className="mt-4">
          <Link
            href={{
              pathname: resolvePage('/organization'),
              query: { slug: formContext.organization.slug },
            }}
            as={`/ong/${formContext.organization.slug}`}
          >
            <a className="btn btn-primary btn--size-3">Ir pra página da ONG</a>
          </Link>

          <Link
            href={{
              pathname: resolvePage('/project-composer'),
              query: { organizationSlug: formContext.organization.slug },
            }}
            as={`/ong/${formContext.organization.slug}/criar-vaga`}
          >
            <a className="btn btn-primary btn--size-3 ml-4">Criar uma vaga</a>
          </Link>
        </div>
      )}
    </p>
  </FormComposerLayout>
)

OrganizationComposerConclusion.displayName = 'OrganizationComposerConclusion'

export default OrganizationComposerConclusion
