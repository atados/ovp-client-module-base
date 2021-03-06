import Link from 'next/link'
import React from 'react'
import FormComposerLayout from '~/components/FormComposer/FormComposerLayout'
import HelpCard from '~/components/HelpCard'
import { Organization } from '~/redux/ducks/organization'
import { defineMessages } from 'react-intl'
import { useIntl } from 'react-intl'
import { Page, PageAs } from '~/common'

interface OrganizationComposerConclusionProps {
  readonly formContext?: { organization: Organization }
}

const {
  SE_COMUNIQUE,
  E_MUITO,
  REVISAO,
  ONG_REGISTRADA,
  NOSSA_EQUIPE,
  PODE_ACESSAR,
  IR_PARA,
  CRIAR_VAGA,
} = defineMessages({
  SE_COMUNIQUE: {
    id: 'SE_COMUNIQUE',
    defaultMessage: 'Se comunique com os voluntários!',
  },
  E_MUITO: {
    id: 'E_MUITO',
    defaultMessage:
      'É muito importante que você se comunique com os voluntários após que receber inscrições em suas vagas.',
  },
  REVISAO: {
    id: 'REVISAO',
    defaultMessage: 'REVISÃO',
  },
  ONG_REGISTRADA: {
    id: 'ONG_REGISTRADA',
    defaultMessage: 'ONG registrada!',
  },
  NOSSA_EQUIPE: {
    id: 'NOSSA_EQUIPE',
    defaultMessage:
      'Nossa equipe irá analisar o cadastro e aprová-lo o mais rápido possível. Fique atento ao seu email.',
  },
  PODE_ACESSAR: {
    id: 'PODE_ACESSAR',
    defaultMessage: 'Mas você já pode acessar a página da sua ONG',
  },
  IR_PARA: {
    id: 'IR_PARA',
    defaultMessage: 'Ir pra página da ONG',
  },
  CRIAR_VAGA: {
    id: 'CRIAR_VAGA',
    defaultMessage: 'Criar uma vaga',
  },
})

const OrganizationComposerConclusion: React.FC<OrganizationComposerConclusionProps> = ({
  formContext,
}) => {
  const intl = useIntl()

  return (
    <FormComposerLayout
      helpPanelChildren={
        <div className="p-5">
          <HelpCard className="card pr-5 pb-5 pl-5 pt-3">
            <h4 className="text-lg font-medium">
              {intl.formatMessage(SE_COMUNIQUE)}
            </h4>
            <p className="text-gray-700 mb-0">{intl.formatMessage(E_MUITO)}</p>
          </HelpCard>
        </div>
      }
    >
      <h4 className="text-gray-600 text-sm">{intl.formatMessage(REVISAO)}</h4>
      <h1 className="font-light mb-1">{intl.formatMessage(ONG_REGISTRADA)}</h1>
      <p className="text-lg text-gray-700 mb-6">
        {intl.formatMessage(NOSSA_EQUIPE)}
        <br /> <br />
        {intl.formatMessage(PODE_ACESSAR)}
        {formContext && formContext.organization && (
          <div className="mt-6">
            <Link
              href={Page.Organization}
              as={PageAs.Organization({
                organizationSlug: formContext.organization.slug,
              })}
            >
              <a className="btn text-white bg-primary-500 hover:bg-primary-600 btn--size-3">
                {intl.formatMessage(IR_PARA)}
              </a>
            </Link>

            <Link
              href={Page.OrganizationNewProject}
              as={PageAs.OrganizationNewProject({
                organizationSlug: formContext.organization.slug,
                stepId: 'inicio',
              })}
            >
              <a className="btn text-white bg-primary-500 hover:bg-primary-600 btn--size-3 ml-6">
                {intl.formatMessage(CRIAR_VAGA)}
              </a>
            </Link>
          </div>
        )}
      </p>
    </FormComposerLayout>
  )
}

OrganizationComposerConclusion.displayName = 'OrganizationComposerConclusion'

export default OrganizationComposerConclusion
