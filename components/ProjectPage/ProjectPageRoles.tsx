import Link from 'next/link'
import React from 'react'
import { Project } from '~/redux/ducks/project'
import { Page } from '~/common'
import { defineMessages } from 'react-intl'
import { useIntl } from 'react-intl'
import ProjectPageRoleItem from '~/components/ProjectPage/ProjectPageRoleItem'

const {
  VAGA_ENCERRADA,
  VAGA_ENCERRADA_TEXT,
  BUSCAR_MAIS,
  COMO_CONTRIBUIR,
} = defineMessages({
  VAGA_ENCERRADA: {
    id: 'VAGA_ENCERRADA',
    defaultMessage: 'Essa vaga foi encerrada',
  },
  VAGA_ENCERRADA_TEXT: {
    id: 'VAGA_ENCERRADA_TEXT',
    defaultMessage:
      'Essa vaga não necessita mais de voluntários. Mas não precisa parar por aqui! Clique abaixo para encontrar outras vagas relacionadas.',
  },
  BUSCAR_MAIS: {
    id: 'BUSCAR_MAIS',
    defaultMessage: 'Buscar outras vagas',
  },
  COMO_CONTRIBUIR: {
    id: 'COMO_CONTRIBUIR',
    defaultMessage: 'Como contribuir',
  },
  VAGAS_COMO: {
    id: 'VAGAS_COMO',
    defaultMessage: 'Vagas esgotadas como',
  },
  VAGAS_COMO2: {
    id: 'VAGAS_COMO2',
    defaultMessage: 'Vagas esgotadas como',
  },
  VAGAS_ESGOTADAS: {
    id: 'VAGAS_ESGOTADAS',
    defaultMessage: 'Vagas esgotadas',
  },
})

interface ProjectPageRolesProps {
  readonly className?: string
  readonly project: Project
  readonly isOwner?: boolean
  readonly onApply?: (roleId?: number) => void
}

const ProjectPageRoles: React.FC<ProjectPageRolesProps> = ({
  className,
  project,
  onApply,
}) => {
  const intl = useIntl()

  if (!project.roles || !project.roles.length) {
    return null
  }

  if (project.closed || project.canceled) {
    return (
      <div className={className}>
        <div className="card rounded-lg p-4">
          <span className="text-xl block">
            {intl.formatMessage(VAGA_ENCERRADA)}
          </span>
          <span className="text-sm text-gray-600">
            {intl.formatMessage(VAGA_ENCERRADA_TEXT)}
          </span>
          <hr />
          <Link href={Page.SearchProjects}>
            <a className="btn bg-white text-primary-500 btn--size-3 btn--block">
              {intl.formatMessage(BUSCAR_MAIS)}
            </a>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <h4 className="mb-6">{intl.formatMessage(COMO_CONTRIBUIR)}</h4>
      {project.roles.map(role => (
        <ProjectPageRoleItem
          key={role.id}
          role={role}
          onApply={onApply}
          project={project}
        />
      ))}
    </div>
  )
}

ProjectPageRoles.displayName = 'ProjectPageRoles'

export default React.memo(ProjectPageRoles)
