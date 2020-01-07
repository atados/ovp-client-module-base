import Link from 'next/link'
import Router from 'next/router'
import React from 'react'
import styled from 'styled-components'
import FormComposerLayout from '~/components/FormComposer/MultistepFormComposerLayout'
import Icon from '~/components/Icon'
import useMultipleStepsForm from '~/hooks/use-multiple-steps-form'
import { defineMessages } from 'react-intl'
import { useIntl } from 'react-intl'
import { Page, PageAs } from '~/base/common'

const CheckIcon = styled(Icon)`
  font-size: 64px;
`

interface ProjectComposerConclusionProps {
  readonly className?: string
}

const {
  VAGA_ENVIADA,
  NOSSA_EQUIPE,
  PODE_ACESSAR,
  VISITAR_PAGINA,
} = defineMessages({
  VAGA_ENVIADA: {
    id: 'VAGA_ENVIADA',
    defaultMessage: 'Vaga enviada para revisão!',
  },
  NOSSA_EQUIPE: {
    id: 'NOSSA_EQUIPE',
    defaultMessage:
      'Nossa equipe irá analisar o cadastro dessa vaga o mais rápido possível. Fique atento ao seu email.',
  },
  PODE_ACESSAR: {
    id: 'PODE_ACESSAR',
    defaultMessage:
      'Você já pode acessar a página da vaga pra ver como ela está e fazer edições caso seja necessário.',
  },
  VISITAR_PAGINA: {
    id: 'VISITAR_PAGINA',
    defaultMessage: 'Visitar página',
  },
})

const ProjectComposerConclusion: React.FC<ProjectComposerConclusionProps> = ({
  className,
}) => {
  const {
    payload: project,
    failedToSubmit,
    currentStepId,
  } = useMultipleStepsForm()
  const intl = useIntl()

  if (!project || failedToSubmit || currentStepId !== 'criado') {
    return null
  }

  const handleSubmit = event => {
    event.preventDefault()
    Router.push(`${'/project'}?slug=${project.slug}`, `/vaga/${project.slug}`)
  }

  return (
    <FormComposerLayout className={className} onSubmit={handleSubmit}>
      <CheckIcon name="check_circle_outline" className="text-green-600" />
      <h2 className="font-normal mb-6">{intl.formatMessage(VAGA_ENVIADA)}</h2>
      <p style={{ maxWidth: '500px' }}>
        {intl.formatMessage(NOSSA_EQUIPE)}
        <br />
        <br />
        {intl.formatMessage(PODE_ACESSAR)}
      </p>
      {project && (
        <Link href={Page.Project} as={PageAs.Project({ slug: project.slug })}>
          <a className="btn btn-primary btn--size-3">
            {intl.formatMessage(VISITAR_PAGINA)}
          </a>
        </Link>
      )}
    </FormComposerLayout>
  )
}

ProjectComposerConclusion.displayName = 'ProjectComposerConclusion'

export default ProjectComposerConclusion
