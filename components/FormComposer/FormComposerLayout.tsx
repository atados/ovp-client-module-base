import * as React from 'react'
import styled from 'styled-components'
import ActivityIndicator from '../ActivityIndicator'
import Icon from '../Icon'
import { FormComposerContext, FormComposerMode } from './FormComposer'

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
  background-size: cover;
  border-left: 1px solid #e7e8e9;
  flex-grow: 1;
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

interface FormComposerLayoutProps {
  readonly className?: string
  readonly mode?: FormComposerMode
  readonly helpPanelChildren?: React.ReactNode
  readonly helpPanelProps?: { style?: React.CSSProperties; className?: string }
  readonly onSubmit?: () => void
  readonly onBack?: () => void
  readonly formProps?: object
  readonly disabled?: boolean
  readonly isSubmitting?: boolean
}

const FormComposerLayout: React.SFC<FormComposerLayoutProps> = ({
  className,
  children,
  helpPanelProps,
  helpPanelChildren,
  onSubmit,
  onBack,
  mode,
  formProps,
  disabled,
  isSubmitting,
}) => (
  <Body className={className}>
    <BodyContent>
      <Form {...formProps} onSubmit={onSubmit}>
        {children}
        {(onBack || onSubmit) && (
          <FormComposerContext.Consumer>
            {({ stepIds, submittedStepIds }) => (
              <Footer>
                <FooterDivider />

                <div className="d-flex">
                  {onBack && mode !== FormComposerMode.EDIT && (
                    <button
                      type="button"
                      onClick={onBack}
                      className={`btn btn--size-4 btn-text`}
                    >
                      <Icon name="arrow_back" className="mr-2" />
                      Voltar
                    </button>
                  )}
                  <div className="mr-auto" />
                  {onSubmit && (
                    <button
                      type="submit"
                      disabled={disabled || isSubmitting}
                      className={`btn btn--size-4 ${
                        disabled ? 'btn-disabled' : 'btn-primary'
                      }`}
                      onClick={onSubmit}
                    >
                      {mode === FormComposerMode.EDIT ? (
                        'Salvar alterações'
                      ) : (
                        <>
                          {submittedStepIds.length >= stepIds.length - 1 ? (
                            <>
                              Concluir <Icon name="check" className="ml-2" />
                            </>
                          ) : (
                            <>
                              Continuar{' '}
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
          </FormComposerContext.Consumer>
        )}
      </Form>
    </BodyContent>
    <HelpPanel
      {...helpPanelProps}
      className={`${
        helpPanelProps && helpPanelProps.className
          ? `${helpPanelProps.className} `
          : ''
      }d-none d-lg-block`}
    >
      {helpPanelChildren}
    </HelpPanel>
  </Body>
)

FormComposerLayout.displayName = 'FormComposerLayout'
FormComposerLayout.defaultProps = {
  mode: FormComposerMode.CREATE,
  className: undefined,
}

export default FormComposerLayout
