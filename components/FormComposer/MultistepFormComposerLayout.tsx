import React, { useMemo } from 'react'
import styled from 'styled-components'
import useMultipleStepsForm from '~/hooks/use-multiple-steps-form'
import ActivityIndicator from '../ActivityIndicator'
import Icon from '../Icon'
import { FormComposerMode } from './FormComposer'
import { useIntl, defineMessages } from 'react-intl'

const Body = styled.div`
  display: flex;
`

const BodyContent = styled.div`
  padding: 2rem 1rem;

  @media (min-width: 576px) {
    padding: 2rem;
  }

  @media (min-width: 992px) {
    padding: 2rem 5rem 2rem 2rem;
  }
`

const HelpPanel = styled.div`
  background: #f6f7f8;
  flex-grow: 1;
  margin: 10px;
  border-radius: 10px;
`

const Footer = styled.div`
  height: 80px;
  padding: 0 20px 20px;
  background: #fff;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 10;

  @media (min-width: 992px) {
    padding: 0 10px 20px;
    width: 520px;
    right: auto;
    left: auto;
    margin-left: -10px;
  }
`

const FooterDivider = styled.div`
  height: 11px;
  background: #fff;
  position: relative;
  margin-bottom: 5px;
  box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.08);

  &::before {
    box-shadow: 0 -9px 15px -5px rgba(0, 0, 0, 0.09);
    height: 18px;
    border-radius: 75%;
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    z-index: -1;
  }
`

const Form = styled.form`
  @media (min-width: 768px) {
    padding-bottom: 90px;
    width: 500px;
  }
`

const m = defineMessages({
  save: {
    id: 'multistepFormComposerLayout.save',
    defaultMessage: 'Salvar alterações',
  },
  complete: {
    id: 'multistepFormComposerLayout.complete',
    defaultMessage: 'Concluir',
  },
  continue: {
    id: 'multistepFormComposerLayout.continue',
    defaultMessage: 'Continuar',
  },
})

interface FormComposerLayoutProps {
  readonly className?: string
  readonly helpPanelChildren?: React.ReactNode
  readonly helpPanelProps?: { style?: React.CSSProperties; className?: string }
  readonly onSubmit?: (event?: React.FormEvent<HTMLFormElement>) => void
  readonly onBack?: () => void
  readonly formProps?: object
  readonly disabled?: boolean
  readonly noForm?: boolean
  readonly isSubmitting?: boolean
}

const FormComposerLayout: React.FC<FormComposerLayoutProps> = ({
  className,
  formProps,
  onSubmit,
  children,
  helpPanelProps,
  helpPanelChildren,
  isSubmitting,
  disabled,
  noForm,
}) => {
  const intl = useIntl()
  const {
    steps,
    currentStepId,
    context: { mode },
  } = useMultipleStepsForm()
  const doneSteps = useMemo(() => steps.filter(step => step.done), [steps])
  const lastStep = steps[steps.length - 1]
  const isLastStep = lastStep && currentStepId === lastStep.id

  return (
    <Body className={className}>
      <BodyContent>
        <Form
          {...formProps}
          as={(noForm ? 'div' : undefined) as any}
          onSubmit={noForm ? undefined : onSubmit}
        >
          {children}
          {onSubmit && (
            <Footer>
              <FooterDivider />

              <div className="flex">
                <div className="mr-auto" />
                {onSubmit && (
                  <button
                    type="submit"
                    disabled={disabled || isSubmitting}
                    className="btn btn--size-4 text-white bg-primary-500 hover:bg-primary-600"
                    onClick={noForm ? () => onSubmit() : undefined}
                  >
                    {mode === FormComposerMode.EDIT ? (
                      intl.formatMessage(m.save)
                    ) : (
                      <>
                        {isLastStep && doneSteps.length >= steps.length - 1 ? (
                          <>
                            {intl.formatMessage(m.complete)}{' '}
                            <Icon name="check" className="ml-2" />
                          </>
                        ) : (
                          <>
                            {intl.formatMessage(m.continue)}{' '}
                            <Icon name="arrow_forward" className="ml-2" />
                          </>
                        )}
                      </>
                    )}
                    {isSubmitting && (
                      <ActivityIndicator
                        size={40}
                        fill="#fff"
                        className="ml-1"
                      />
                    )}
                  </button>
                )}
              </div>
            </Footer>
          )}
        </Form>
      </BodyContent>
      <HelpPanel
        {...helpPanelProps}
        className={`${
          helpPanelProps && helpPanelProps.className
            ? `${helpPanelProps.className} `
            : ''
        }hidden lg:block`}
      >
        {helpPanelChildren}
      </HelpPanel>
    </Body>
  )
}

FormComposerLayout.displayName = 'FormComposerLayout'

export default FormComposerLayout
