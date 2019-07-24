import * as React from 'react'
import styled, { keyframes } from 'styled-components'
import { FormComposerStep } from '~/components/FormComposer/FormComposer'
import FormComposerLayout from '~/components/FormComposer/FormComposerLayout'
import Icon from '~/components/Icon'

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

interface OrganizationComposerIntroProps {
  readonly onStart: () => void
  readonly onStartFromDraft: () => void
  readonly fetchingDraft: boolean
  readonly steps: FormComposerStep[]
}

const OrganizationComposerIntro: React.SFC<OrganizationComposerIntroProps> = ({
  onStartFromDraft,
  onStart,
  steps,
  fetchingDraft,
}) => {
  let body

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
          Continue a cadastrar sua ONG
          <Icon name="arrow_forward" className="ml-2" />
        </button>
        <PresentationStep type="button" onClick={onStartFromDraft}>
          <span className="tw-medium tc-primary">CONTINUAR</span>
          <h2 className="mb-1 tw-normal">Continue do ponto que parou</h2>
          <p className="ts-medium mb-3">
            As informações que preencheu continuam salvas. Deseja continuar?
          </p>
          <div className="progress">
            <div
              className="progress-value bg-primary"
              style={{ width: '50%' }}
            />
          </div>
        </PresentationStep>
        <PresentationStep type="button" onClick={onStart}>
          <span className="tw-medium tc-muted">NOVO</span>
          <h2 className="mb-1 tw-normal">Criar nova ONG</h2>
          <p className="ts-medium mb-0">
            Descartar informações que eu já havia preenchido
          </p>
        </PresentationStep>
      </>
    ) : (
      <>
        <button
          type="button"
          className="btn btn-primary btn--size-3 mt-3"
          onClick={onStart}
        >
          Comece a cadastrar sua ONG
          <Icon name="arrow_forward" className="ml-2" />
        </button>
        {steps.map((step, i) => (
          <PresentationStep
            key={step.id}
            type="button"
            disabled={i !== 0}
            onClick={onStart}
          >
            <span className="tw-medium tc-muted">ETAPA {i + 1}</span>
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
              FAÇA PARTE DA NOSSA REDE
            </span>
            <h1>
              Mais de 80.000 <br /> pessoas interessadas em serem voluntárias
            </h1>
            <p className="ts-medium">
              Se a sua ONG, coletivo ou movimento social está em busca de
              voluntários para colaborar com a sua causa, conte para a rede do
              Atados.
            </p>
            <h4 className="h1 tc-secondary">9 a cada 10</h4>
            <p className="ts-large tc-secondary">VAGAS SÃO PREENCHIDAS</p>
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
        <h1 className="h2 tw-normal">Olá, vamos cadastrar sua ONG?</h1>
        <p className="ts-medium">
          A inscrição funciona a partir das seguintes etapas. Após concluidas,
          será feita a revisão das informações pela nossa equipe.
        </p>
        {body}
      </FormComposerLayout>
    </Container>
  )
}

OrganizationComposerIntro.displayName = 'OrganizationComposerIntro'

export default OrganizationComposerIntro
