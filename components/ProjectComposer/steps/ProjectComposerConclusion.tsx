import Link from 'next/link'
import Router from 'next/router'
import React from 'react'
import styled from 'styled-components'
import { resolvePage } from '~/common/page'
import FormComposerLayout from '~/components/FormComposer/MultistepFormComposerLayout'
import Icon from '~/components/Icon'
import useMultipleStepsForm from '~/hooks/use-multiple-steps-form'

const CheckIcon = styled(Icon)`
  font-size: 64px;
`

interface ProjectComposerConclusionProps {
  readonly className?: string
}

const ProjectComposerConclusion: React.FC<ProjectComposerConclusionProps> = ({
  className,
}) => {
  const {
    payload: project,
    failedToSubmit,
    currentStepId,
  } = useMultipleStepsForm()

  if (!project || failedToSubmit || currentStepId !== 'criado') {
    return null
  }

  const handleSubmit = event => {
    event.preventDefault()
    Router.push(
      `${resolvePage('/project')}?slug=${project.slug}`,
      `/vaga/${project.slug}`,
    )
  }

  return (
    <FormComposerLayout className={className} onSubmit={handleSubmit}>
      <CheckIcon name="check_circle_outline" className="tc-success" />
      <h2 className="tw-normal mb-4">Vaga enviada para revisão!</h2>
      <p style={{ maxWidth: '500px' }}>
        Nossa equipe irá analisar o cadastro dessa vaga o mais rápido possível.
        Fique atento ao seu email.
        <br />
        <br />
        Você já pode acessar a página da vaga pra ver como ela está e fazer
        edições caso seja necessário.
      </p>
      {project && (
        <Link
          href={{
            pathname: resolvePage('/project'),
            query: { slug: project.slug },
          }}
          as={`/vaga/${project.slug}`}
        >
          <a className="btn btn-primary btn--size-3">Visitar página</a>
        </Link>
      )}
    </FormComposerLayout>
  )
}

ProjectComposerConclusion.displayName = 'ProjectComposerConclusion'

export default ProjectComposerConclusion
