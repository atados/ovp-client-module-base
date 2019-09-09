import React from 'react'
import styled, { keyframes } from 'styled-components'
import { FormComposerStep } from '~/components/FormComposer/FormComposer'
import FormComposerLayout from '~/components/FormComposer/FormComposerLayout'
import Icon from '~/components/Icon'
import { defineMessages } from 'react-intl'
import useIntl from '~/hooks/use-intl'

const Container = styled.div`
  .intro-help-panel {
    position: fixed;
    top: 50px;
    right: 0;
    bottom: 0;
    background-color: #fff;
    background-repeat: no-repeat;
    background-image: url('/base/images/organization-composer-bg-effect-1.svg');
    background-position: top left;
    left: 60%;
  }
`
const PresentationStep = styled.button`
  width: 100%;
  background: none;
  border: 0;
  text-align: left;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 30px 0;
  cursor: pointer;
  transition: padding-left 0.2s;

  @media (min-width: 768px) {
    &:hover {
      padding-left: 10px;
    }
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    opacity: 0.5;
    border-bottom-color: rgba(0, 0, 0, 0.15);
  }

  &:disabled:hover {
    padding-left: 0;
  }
`

const SidebarInner = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
  color: #fff;
  padding: 50% 60px 60px;
`

const blink = keyframes`
  0% {
   opacity: 1;
 }

  50% {
  opacity: 0.5;
 }

  100% {
  opacity: 1;
 }
`

const PresentationStepPlaceholder = styled.div`
  padding: 30px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`

const TextPlaceholder = styled.div`
  background: #ddd;
  animation: ${blink} 1s ease-in-out 0s infinite normal;
`

const {
  CONTINUE_A_CADASTRAR,
  CONTINUAR,
  CONTINUE_DO_PONTO,
  AS_INFORMACOES,
  NOVO,
  CRIAR,
  DESCARTAR,
  COMECE,
  ETAPA,
  FACA_PARTE,
  PESSOAS_INTERESSADAS,
  SE_SUA_ONG,
  A_CADA,
  VAGAS_PREENCHIDAS,
  OLA,
  A_INSCRICAO,
} = defineMessages({
  CONTINUE_A_CADASTRAR: {
    id: 'CONTINUE_A_CADASTRAR',
    defaultMessage: 'Continue a cadastrar sua ONG',
  },
  CONTINUAR: {
    id: 'CONTINUAR',
    defaultMessage: 'CONTINUAR',
  },
  CONTINUE_DO_PONTO: {
    id: 'CONTINUE_DO_PONTO',
    defaultMessage: 'Continue do ponto que parou',
  },
  AS_INFORMACOES: {
    id: 'AS_INFORMACOES',
    defaultMessage: 'Público que será atendido pelo voluntariado;',
  },
  NOVO: {
    id: 'NOVO',
    defaultMessage: 'NOVO',
  },
  CRIAR: {
    id: 'CRIAR',
    defaultMessage: 'Criar nova ONG',
  },
  DESCARTAR: {
    id: 'DESCARTAR',
    defaultMessage: 'Descartar informações que eu já havia preenchido',
  },
  COMECE: {
    id: 'COMECE',
    defaultMessage: 'Comece a cadastrar sua ONG',
  },
  ETAPA: {
    id: 'ETAPA',
    defaultMessage: 'ETAPA',
  },
  FACA_PARTE: {
    id: 'FACA_PARTE',
    defaultMessage: 'FAÇA PARTE DA NOSSA REDE',
  },
  PESSOAS_INTERESSADAS: {
    id: 'PESSOAS_INTERESSADAS',
    defaultMessage: 'Mais de 80.000 pessoas interessadas em serem voluntárias',
  },
  SE_SUA_ONG: {
    id: 'SE_SUA_ONG',
    defaultMessage:
      'Se a sua ONG, coletivo ou movimento social está em busca de voluntários para colaborar com a sua causa, conte para a rede do Atados.',
  },
  A_CADA: {
    id: 'A_CADA',
    defaultMessage: '9 a cada 10',
  },
  VAGAS_PREENCHIDAS: {
    id: 'VAGAS_PREENCHIDAS',
    defaultMessage: 'VAGAS SÃO PREENCHIDAS',
  },
  OLA: {
    id: 'OLA',
    defaultMessage: 'Olá, vamos cadastrar sua ONG?',
  },
  A_INSCRICAO: {
    id: 'A_INSCRICAO',
    defaultMessage:
      'A inscrição funciona a partir das seguintes etapas. Após concluidas, será feita a revisão das informações pela nossa equipe.',
  },
})

interface OrganizationComposerIntroProps {
  readonly onStart: () => void
  readonly onStartFromDraft: () => void
  readonly fetchingDraft: boolean
  readonly steps: FormComposerStep[]
}

const OrganizationComposerIntro: React.FC<OrganizationComposerIntroProps> = ({
  onStartFromDraft,
  onStart,
  steps,
  fetchingDraft,
}) => {
  let body
  const intl = useIntl()

  if (fetchingDraft) {
    body = (
      <>
        <PresentationStepPlaceholder>
          <TextPlaceholder style={{ height: '19px' }} className="w-50 mb-2" />
          <TextPlaceholder
            style={{ backgroundColor: '#aaa', height: '38px' }}
            className="mb-2"
          />
          <TextPlaceholder style={{ height: '26px' }} className="w-50" />
        </PresentationStepPlaceholder>
        <PresentationStepPlaceholder>
          <TextPlaceholder style={{ height: '19px' }} className="mb-2" />
          <TextPlaceholder
            style={{ backgroundColor: '#aaa', height: '38px' }}
            className="mb-2"
          />
          <TextPlaceholder style={{ height: '26px' }} className="w-50" />
        </PresentationStepPlaceholder>
      </>
    )
  } else {
    body = onStartFromDraft ? (
      <>
        <button
          type="button"
          className="btn btn-primary btn--size-3 mt-3"
          onClick={onStartFromDraft}
        >
          {intl.formatMessage(CONTINUE_A_CADASTRAR)}
          <Icon name="arrow_forward" className="ml-2" />
        </button>
        <PresentationStep type="button" onClick={onStartFromDraft}>
          <span className="tw-medium tc-primary">
            {intl.formatMessage(CONTINUAR)}
          </span>
          <h2 className="mb-1 tw-normal">
            {intl.formatMessage(CONTINUE_DO_PONTO)}
          </h2>
          <p className="ts-medium mb-3">{intl.formatMessage(AS_INFORMACOES)}</p>
          <div className="progress">
            <div
              className="progress-value bg-primary"
              style={{ width: '50%' }}
            />
          </div>
        </PresentationStep>
        <PresentationStep type="button" onClick={onStart}>
          <span className="tw-medium tc-muted">{intl.formatMessage(NOVO)}</span>
          <h2 className="mb-1 tw-normal">{intl.formatMessage(CRIAR)}</h2>
          <p className="ts-medium mb-0">{intl.formatMessage(DESCARTAR)}</p>
        </PresentationStep>
      </>
    ) : (
      <>
        <button
          type="button"
          className="btn btn-primary btn--size-3 mt-3"
          onClick={onStart}
        >
          {intl.formatMessage(COMECE)}
          <Icon name="arrow_forward" className="ml-2" />
        </button>
        {steps.map((step, i) => (
          <PresentationStep
            key={step.id}
            type="button"
            disabled={i !== 0}
            onClick={onStart}
          >
            <span className="tw-medium tc-muted">
              {intl.formatMessage(ETAPA)} {i + 1}
            </span>
            <h2 className="mb-1 tw-normal">{step.name}</h2>
            <p className="ts-medium mb-0">{step.description}</p>
          </PresentationStep>
        ))}
      </>
    )
  }
  return (
    <Container>
      <FormComposerLayout
        helpPanelChildren={
          <SidebarInner>
            <span className="tw-medium ts-medium">
              {intl.formatMessage(FACA_PARTE)}
            </span>
            <h1>{intl.formatMessage(PESSOAS_INTERESSADAS)}</h1>
            <p className="ts-medium">{intl.formatMessage(SE_SUA_ONG)}</p>
            <h4 className="h1 tc-secondary">{intl.formatMessage(A_CADA)}</h4>
            <p className="ts-large tc-secondary">
              {intl.formatMessage(VAGAS_PREENCHIDAS)}
            </p>
          </SidebarInner>
        }
        helpPanelProps={{
          className: 'intro-help-panel',
          style: {
            backgroundImage:
              'url(https://c1.staticflickr.com/5/4844/45183592844_c28cf4272a_b.jpg)',
          },
        }}
      >
        <h1 className="h2 tw-normal">{intl.formatMessage(OLA)}</h1>
        <p className="ts-medium">{intl.formatMessage(A_INSCRICAO)}</p>
        {body}
      </FormComposerLayout>
    </Container>
  )
}

OrganizationComposerIntro.displayName = 'OrganizationComposerIntro'

export default OrganizationComposerIntro
