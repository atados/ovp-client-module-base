import moment from 'moment'
import Link from 'next/link'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import Icon from '~/components/Icon'
import useMultipleStepsForm from '~/hooks/use-multiple-steps-form'
import { ProjectComposerDraft } from '~/pages/project-composer'
import { defineMessages } from 'react-intl'
import { useIntl } from 'react-intl'
import { Page, PageAs, Color } from '~/common'

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
    border-color: ${Color.primary[500]};
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

const {
  NOVA_VAGA,
  COMO_COMECAR,
  SALVAMOS,
  CRIAR_VAGA,
  CONTINUE,
  ADICIONE_NOME,
  ADICIONE_DESCRICAO,
  ATUALIZADO,
} = defineMessages({
  NOVA_VAGA: {
    id: 'NOVA_VAGA',
    defaultMessage: 'NOVA VAGA',
  },
  COMO_COMECAR: {
    id: 'COMO_COMECAR',
    defaultMessage: 'Como você gostaria de começar?',
  },
  SALVAMOS: {
    id: 'SALVAMOS',
    defaultMessage: 'Nós salvamos o seus ultimos rascunhos para não perder.',
  },
  CRIAR_VAGA: {
    id: 'CRIAR_VAGA',
    defaultMessage: 'Criar uma nova vaga',
  },
  CONTINUE: {
    id: 'CONTINUE',
    defaultMessage: 'CONTINUE DA ONDE VOCÊ PAROU:',
  },
  ADICIONE_NOME: {
    id: 'ADICIONE_NOME',
    defaultMessage: 'Adicione um nome',
  },
  ADICIONE_DESCRICAO: {
    id: 'ADICIONE_DESCRICAO',
    defaultMessage: 'Adicione uma descrição',
  },
  ATUALIZADO: {
    id: 'ATUALIZADO',
    defaultMessage: 'Atualizado',
  },
})

interface ProjectComposerIntroProps {
  readonly pageName: string
  readonly className?: string
  readonly organizationSlug?: string
  readonly drafts: ProjectComposerDraft[]
}

const ProjectComposerIntro: React.FC<ProjectComposerIntroProps> = ({
  className,
  drafts,
  pageName,
  organizationSlug,
}) => {
  const { currentStepId, steps } = useMultipleStepsForm()

  if (currentStepId !== 'inicio') {
    return null
  }

  const firstStep = steps[0]
  const intl = useIntl()
  const orderedDrafts = useMemo(
    () => drafts.sort((draft1, draft2) => draft2.updatedAt - draft1.updatedAt),
    [drafts],
  )

  return (
    <div className={`p-5${className ? ` ${className}` : ''}`}>
      <h4 className="text-gray-600 text-sm">{intl.formatMessage(NOVA_VAGA)}</h4>
      <h1 className="font-light mb-1">{intl.formatMessage(COMO_COMECAR)}</h1>
      <p className="text-lg text-gray-700 mb-6">
        {intl.formatMessage(SALVAMOS)}
      </p>
      {firstStep && (
        <Link
          href={Page[pageName]}
          as={PageAs[pageName]({ stepId: firstStep.id, organizationSlug })}
        >
          <Option className="mb-6 animate-slideInUp">
            <figure>
              <OptionIcon name="add" />
            </figure>
            <OptionTitleCenter className="h4 font-normal mb-1 truncate block">
              {intl.formatMessage(CRIAR_VAGA)}
            </OptionTitleCenter>
          </Option>
        </Link>
      )}
      {orderedDrafts.length > 0 && (
        <h4 className="text-gray-600 text-sm mb-4 mt-6">
          {intl.formatMessage(CONTINUE)}
        </h4>
      )}
      {firstStep &&
        orderedDrafts.map((draft, draftIndex) => (
          <Link
            key={draftIndex}
            href={{ pathname: Page[pageName], query: { draftIndex } }}
            as={`${PageAs[pageName]({
              stepId: firstStep.id,
              organizationSlug,
            })}/?draftIndex=${draftIndex}`}
            passHref
          >
            <Option className="animate-slideInUp mb-4">
              <figure
                style={
                  draft.value.image
                    ? { backgroundImage: `url(${draft.value.image.image_url})` }
                    : undefined
                }
              />
              <OptionTitle className="mb-1 truncate block">
                {draft.value.name || intl.formatMessage(ADICIONE_NOME)}
              </OptionTitle>
              <p className="text-gray-700 font-normal">
                {draft.value.description ||
                  intl.formatMessage(ADICIONE_DESCRICAO)}
              </p>
              <span className="text-gray-600 text-sm">
                {`${intl.formatMessage(ATUALIZADO)} ${moment(
                  draft.updatedAt,
                ).fromNow()}`}
              </span>
            </Option>
          </Link>
        ))}
    </div>
  )
}

ProjectComposerIntro.displayName = 'ProjectComposerIntro'

export default ProjectComposerIntro
