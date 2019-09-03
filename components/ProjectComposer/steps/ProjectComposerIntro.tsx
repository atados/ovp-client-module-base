import moment from 'moment'
import Link from 'next/link'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { channel } from '~/common/constants'
import Icon from '~/components/Icon'
import useMultipleStepsForm from '~/hooks/use-multiple-steps-form'
import { ProjectComposerDraft } from '~/pages/project-composer'

const Option = styled.a`
  border-radius: 10px;
  border: 1px solid #ccc;
  padding: 1rem;
  text-align: left;
  width: 100%;
  max-width: 600px;
  cursor: pointer;
  display: block;
  min-height: 112px;

  > figure {
    width: 80px;
    height: 80px;
    background-color: #e9e9e9;
    border-radius: 10px;
    float: left;
    margin: 0 1rem 0 0;
    text-align: center;
    background-position: center;
    background-size: cover;
  }

  p {
    margin: 0;
  }

  &:hover {
    border-color: ${channel.theme.color.primary[500]};
  }
`

const OptionTitle = styled.span`
  font-size: 18px;
  font-weight: 500;
`

const OptionTitleCenter = styled.span`
  margin-top: 1.5rem;
`

const OptionIcon = styled(Icon)`
  font-size: 42px;
  margin-top: 0.5rem;
  color: rgba(0, 0, 0, 0.7);
`

interface ProjectComposerIntroProps {
  readonly query: any
  readonly routerPathname: string
  readonly routerAs: string
  readonly className?: string
  readonly drafts: ProjectComposerDraft[]
}

const ProjectComposerIntro: React.FC<ProjectComposerIntroProps> = ({
  className,
  drafts,
  routerPathname,
  routerAs,
  query,
}) => {
  const { currentStepId, steps } = useMultipleStepsForm()

  if (currentStepId !== 'inicio') {
    return null
  }

  const firstStep = steps[0]
  const orderedDrafts = useMemo(
    () => drafts.sort((draft1, draft2) => draft2.updatedAt - draft1.updatedAt),
    [drafts],
  )

  return (
    <div className={`p-5${className ? ` ${className}` : ''}`}>
      <h4 className="tc-muted ts-small">NOVA VAGA</h4>
      <h1 className="tw-light mb-1">Como você gostaria de começar?</h1>
      <p className="ts-medium tc-muted-dark mb-4">
        Nós salvamos o seus ultimos rascunhos para não perder.
      </p>
      {firstStep && (
        <Link
          href={{
            pathname: routerPathname,
            query: { ...query, stepId: firstStep.id },
          }}
          as={`${routerAs}${firstStep.id}`}
        >
          <Option className="mb-4 animate-slideInUp">
            <figure>
              <OptionIcon name="add" />
            </figure>
            <OptionTitleCenter className="h4 tw-normal mb-1 text-truncate block">
              Criar uma nova vaga
            </OptionTitleCenter>
          </Option>
        </Link>
      )}
      {orderedDrafts.length > 0 && (
        <h4 className="tc-muted ts-small mb-3 mt-4">
          CONTINUE DA ONDE VOCÊ PAROU:
        </h4>
      )}
      {firstStep &&
        orderedDrafts.map((draft, draftIndex) => (
          <Link
            key={draftIndex}
            href={{
              pathname: routerPathname,
              query: { ...query, stepId: firstStep.id, draftIndex },
            }}
            as={`${routerAs}${firstStep.id}?draftIndex=${draftIndex}`}
          >
            <Option className="animate-slideInUp mb-3">
              <figure
                style={
                  draft.value.image
                    ? { backgroundImage: `url(${draft.value.image.image_url})` }
                    : undefined
                }
              />
              <OptionTitle className="mb-1 text-truncate block">
                {draft.value.name || 'Adicione um nome'}
              </OptionTitle>
              <p className="tc-muted-dark tw-normal">
                {draft.value.description || 'Adicione uma descrição'}
              </p>
              <span className="tc-muted ts-small">
                Atualizado {moment(draft.updatedAt).fromNow()}
              </span>
            </Option>
          </Link>
        ))}
    </div>
  )
}

ProjectComposerIntro.displayName = 'ProjectComposerIntro'

export default ProjectComposerIntro
