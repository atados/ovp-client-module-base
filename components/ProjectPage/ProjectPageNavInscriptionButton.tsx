import { defineMessages, useIntl } from 'react-intl'
import Link from 'next/link'
import React from 'react'
import { Page, PageAs, Config } from '~/common'
import Icon from '~/components/Icon'
import VolunteerIcon from '../Icon/VolunteerIcon'
import styled from 'styled-components'

const ActionButton = styled.a`
  position: relative;

  > svg {
    margin: -6px 10px -3px 0;
  }

  @media (min-width: 768px) {
    min-width: 352px;
  }
`

const {
  GERENCIAR_VAGA,
  QUERO_INSCREVER,
  VER_INSCRICAO,
  NAO_HA_VAGAS,
} = defineMessages({
  GERENCIAR_VAGA: {
    id: 'GERENCIAR_VAGA',
    defaultMessage: 'Gerenciar vaga',
  },
  QUERO_INSCREVER: {
    id: 'QUERO_INSCREVER',
    defaultMessage: 'Quero me inscrever',
  },
  VER_INSCRICAO: {
    id: 'VER_INSCRICAO',
    defaultMessage: 'Ver minha inscrição',
  },
  NAO_HA_VAGAS: {
    id: 'NAO_HA_VAGAS',
    defaultMessage: 'Não há vagas',
  },
})

const InscriptionButton = ({
  isOwner,
  project,
  hasVacancies,
  handleApplication,
}) => {
  const intl = useIntl()

  if (isOwner) {
    return (
      <Link
        href={
          project.organization
            ? Page.OrganizationDashboardProject
            : Page.ViewerProjectDashboard
        }
        as={
          project.organization
            ? PageAs.OrganizationDashboardProject({
                organizationSlug: project.organization.slug,
                projectSlug: project.slug,
              })
            : PageAs.ViewerProjectDashboard({
                projectSlug: project.slug,
              })
        }
        passHref
      >
        <ActionButton className="btn text-white bg-primary-500 hover:bg-primary-600 btn--size-3">
          <Icon name="settings" className="mr-2" />
          {intl.formatMessage(GERENCIAR_VAGA)}
        </ActionButton>
      </Link>
    )
  }

  if (!project.closed && !project.canceled) {
    if (Config.project.blockApplicationsAtLimit && !hasVacancies) {
      return (
        <ActionButton className="btn btn-muted btn--size-3 truncate text-red-600 cursor-default">
          {intl.formatMessage(NAO_HA_VAGAS)}
        </ActionButton>
      )
    }

    return (
      <ActionButton
        as="button"
        className={`btn ${
          project.current_user_is_applied
            ? 'text-primary-500 border-primary-500 hover:bg-primary-100'
            : 'text-white bg-primary-500 hover:bg-primary-600'
        } btn--size-3`}
        onClick={handleApplication}
      >
        {!project.current_user_is_applied ? (
          <>
            <VolunteerIcon width={20} height={20} fill="#fff" />
            {intl.formatMessage(QUERO_INSCREVER)}
          </>
        ) : (
          <>
            <Icon name="assignment" className="mr-2" />
            {intl.formatMessage(VER_INSCRICAO)}
          </>
        )}
      </ActionButton>
    )
  }

  return null
}

export default InscriptionButton
