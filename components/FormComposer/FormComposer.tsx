import React from 'react'
import styled from 'styled-components'
import { reportError } from '~/lib/utils/error'
import ActivityIndicator from '../ActivityIndicator'
import { channel } from '~/base/common/constants'

const Container = styled.div`
  background: #f4f5f6;
  padding: 20px 0 70px;

  @media (min-width: 992px) {
    padding-bottom: 0;
  }
`

const Header = styled.div`
  background: #f6f7f8;
  box-shadow: inset 0 -1px rgba(0, 0, 0, 0.1);
`
const Progress = styled.div`
  height: 4px;
  background: #e6e7e8;
`

const ProgressValue = styled.span`
  display: block;
  height: 4px;
  background: ${channel.theme.color.secondary[500]};
  transition: width 0.2s;
`

const DraftedIndicator = styled.span`
  transition: opacity 0.5s, visibility 0.5s;
  position: fixed;
  top: -20px;
  transition: top 0.2s, opacity 0.2s;
  left: 0;
  right: 0;
  background: #3ba950;
  color: #fff;
  z-index: 1000;
  width: 200px;
  margin: auto;
  padding: 8px 12px;
  text-align: center;
  border-radius: 0 0 3px 3px;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  border-radius: 25px;

  &.active {
    opacity: 1;
    visibility: visible;
    top: 10px;
  }
`

const StepsNav = styled.div`
  height: 100%;

  @media (min-width: 768px) {
    display: flex;
  }
`

const StepLink = styled.button`
  display: block;
  width: 100%;
  padding: 1rem 2rem;
  cursor: pointer;
  border: 0;
  border-right: 1px solid #ddd;
  color: #666;
  border-radius: 0;
  background: #f6f7f8;
  box-shadow: inset 0 -1px rgba(0, 0, 0, 0.1);

  .composer-mode-new &,
  &:focus {
    box-shadow: none;
  }

  &.active {
    color: #222;
    font-weight: 500;
    background: #fff;
    box-shadow: -2px 0 ${channel.theme.color.secondary[500]};
  }

  @media (min-width: 768px) {
    width: auto;
    display: inline-block;

    &.active {
      box-shadow: 0 -2px ${channel.theme.color.secondary[500]};
    }
  }
`

const Card = styled.div`
  border-bottom-width: 0;
`

const Status = styled.div`
  position: fixed;
  top: ${props => props.theme.toolbarHeight + 50}px;
  height: 36px;
  left: 0;
  right: 0;
  background: #3ba950;
  z-index: 98;
  font-size: 14px;
  padding: 8px 0;
`

export interface FormComposerContextType {
  stepIds: string[]
  submittedStepIds: string[]
}

export const FormComposerContext = React.createContext<FormComposerContextType>(
  {
    stepIds: [],
    submittedStepIds: [],
  },
)

export interface FormComposerStepProps<Value> {
  formContext?: any
  isComposerSubmitting?: boolean
  mode?: FormComposerMode
  onBack?: () => void
  onSubmit: (value: Value) => void
  onChange?: (value: Value) => void
  defaultValue?: Value
}

export type StepComponentType = React.ComponentType<
  FormComposerStepProps<any>
> & { isValidValue?: (values: any) => Promise<boolean> }
export interface FormComposerStep {
  id: string
  name: string
  description: string
  title: string
  component: StepComponentType
}

export enum StepIds {
  Introduction,
  Conclusion,
}

export type StepIdType = string | StepIds

interface IntroductionProps {
  context?: any
  steps: FormComposerStep[]
  fetchingDraft?: boolean
  onStart: () => void
  onStartFromDraft?: () => void
}

export enum FormComposerMode {
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  DUPLICATE = 'DUPLICATE',
}

export interface FormComposerProps {
  readonly header?: false | React.ReactNode
  readonly skipingDisabled?: boolean
  readonly context?: any
  readonly stepId?: StepIdType
  readonly mode: FormComposerMode
  readonly introduction?: React.ComponentType<IntroductionProps>
  readonly conclusion?: React.ComponentType<{
    values?: { [stepId: string]: any }
    formContext?: any
  }>
  readonly onStepChange?: (stepId: string) => void
  readonly className?: string
  readonly steps: FormComposerStep[]
  readonly draftKey?: string
  readonly onSubmit: (values: { [stepId: string]: any }) => any
  readonly isSubmitting?: boolean
  readonly defaultValues?: { [stepId: string]: any }
}

interface FormComposerState {
  readonly statusMessage?: string
  readonly stepIds: string[]
  readonly submittedStepIds: string[]
  readonly fetchingDraft: boolean
  readonly showDraftedIndicator: boolean
  readonly values: { [stepId: string]: any }
  readonly stepId: string | StepIds
  readonly step?: FormComposerStep
  readonly stepIndex: number
  readonly submitted?: boolean
  readonly draftLoaded?: boolean
}

class FormComposer extends React.Component<
  FormComposerProps,
  FormComposerState
> {
  public static defaultProps = {
    mode: FormComposerMode.CREATE,
  }

  public static getDerivedStateFromProps(
    props: FormComposerProps,
    state?: FormComposerState,
  ): FormComposerState {
    let stepIndex = state ? state.stepIndex : -1
    let stepId: string | StepIds = StepIds.Introduction
    let step: FormComposerStep | undefined = state ? state.step : undefined

    if ((state && !state.fetchingDraft) || !props.draftKey) {
      if (props.stepId === undefined) {
        if (state) {
          stepId = state.stepId
        } else if (!props.introduction && props.steps.length > 1) {
          stepId = props.steps[0].id
          stepIndex = 0
        }
      } else {
        stepId = props.stepId
      }

      if (!state || stepId !== state.stepId) {
        if (stepId === StepIds.Introduction) {
          step = undefined
          stepIndex = -1
        } else {
          step = props.steps.find((stepItem, i) => {
            if (stepItem.id === stepId) {
              stepIndex = i
              return true
            }

            return false
          })
        }
      }
    } else {
      stepIndex = -1
      step = undefined
    }

    return {
      stepIds: props.steps.map(s => s.id),
      fetchingDraft: state
        ? state.fetchingDraft
        : !!props.draftKey && props.mode === FormComposerMode.CREATE,
      values: state ? state.values : props.defaultValues || {},
      stepId,
      step,
      stepIndex,
      showDraftedIndicator: state ? state.showDraftedIndicator : false,
      submittedStepIds: state ? state.submittedStepIds : [],
    }
  }

  public draftedTimeout?: number
  public statusTimeout?: number

  constructor(props) {
    super(props)

    this.state = FormComposer.getDerivedStateFromProps(props)
  }

  public componentDidMount() {
    if (this.props.mode === FormComposerMode.CREATE) {
      this.loadDraft()
    }
  }

  public componentWillUnmount() {
    if (this.draftedTimeout) {
      clearTimeout(this.draftedTimeout)
    }
  }

  public handleStepChange = (stepId: string, value: any) => {
    const values = {
      ...this.state.values,
      [stepId]: value,
    }

    this.setState({ values }, this.saveDraft)
  }

  public handleStepSubmit = async (stepId: string, value: any) => {
    const submittedStepIds =
      this.state.submittedStepIds.indexOf(stepId) === -1
        ? [...this.state.submittedStepIds, stepId]
        : this.state.submittedStepIds
    const values = {
      ...this.state.values,
      [stepId]: value,
    }

    // Update values and save draft
    this.setState({ values, submittedStepIds }, this.saveDraft)

    const { mode, steps, onSubmit, isSubmitting } = this.props
    const { stepIndex } = this.state

    if (isSubmitting) {
      return
    }

    // Submit if is on last step or, if in edit mode, submit on every step submittion
    if (mode === FormComposerMode.EDIT || stepIndex === steps.length - 1) {
      try {
        const { defaultValues } = this.props
        const updatedValues = values

        // Send default values on steps that weren't submitted
        if (mode === FormComposerMode.EDIT && defaultValues) {
          this.props.steps.forEach(step => {
            if (submittedStepIds.indexOf(step.id) === -1) {
              updatedValues[step.id] = defaultValues[step.id]
            }
          })
        }

        await onSubmit(updatedValues)

        // Delete draft if succeeds
        this.deleteDraft()

        if (mode === FormComposerMode.CREATE) {
          this.setState({ submitted: true })
        } else if (mode === FormComposerMode.EDIT) {
          this.setState({
            statusMessage: 'As alterações foram feitas com sucesso',
          })

          if (this.statusTimeout) {
            clearTimeout(this.statusTimeout)
          }

          this.statusTimeout = window.setTimeout(
            () => this.setState({ statusMessage: undefined }),
            3000,
          )
        }
      } catch (error) {
        reportError(error)
      }
    } else {
      this.setStep(steps[stepIndex + 1].id)
    }
  }

  public deleteDraft = () => {
    const { draftKey } = this.props

    if (draftKey) {
      const localStorageDraftKey = `@@form-composer/draft/${draftKey}`
      localStorage.removeItem(localStorageDraftKey)
    }
  }

  public loadDraft = () => {
    const { draftKey } = this.props
    const stepId = this.props.stepId || this.state.stepId

    if (draftKey) {
      const localStorageDraftKey = `@@form-composer/draft/${draftKey}`
      const draftJSON = localStorage.getItem(localStorageDraftKey)

      try {
        let stepIndex: number = -1
        const step = this.props.steps.find((stepItem, i) => {
          if (stepItem.id === stepId) {
            stepIndex = i
            return true
          }

          return false
        })

        if (!draftJSON) {
          this.setState({
            stepId: stepId || this.state.stepId,
            step,
            stepIndex,
            fetchingDraft: false,
            draftLoaded: false,
          })
          return
        }

        const values = JSON.parse(draftJSON)

        this.setState({
          stepId: stepId || this.state.stepId,
          step,
          stepIndex,
          values,
          fetchingDraft: false,
          draftLoaded: true,
        })
      } catch (error) {
        console.error(`Failed to load draft '${draftKey}'`, error)
        localStorage.removeItem(localStorageDraftKey)
      }
    } else if (this.state.fetchingDraft) {
      this.setState({
        fetchingDraft: false,
      })
    }
  }

  public saveDraft = () => {
    const { draftKey } = this.props

    if (draftKey) {
      const { values } = this.state
      localStorage.setItem(
        `@@form-composer/draft/${draftKey}`,
        JSON.stringify(values),
      )

      this.setState({
        showDraftedIndicator: true,
      })

      if (this.draftedTimeout) {
        clearTimeout(this.draftedTimeout)
      }

      this.draftedTimeout = window.setTimeout(() => {
        this.setState({ showDraftedIndicator: false })
      }, 2000)
    }
  }

  public start = () => {
    const { steps } = this.props
    if (steps.length) {
      this.deleteDraft()
      this.setState({ values: {}, draftLoaded: false }, () => {
        this.setStep(steps[0].id)
      })
    }
  }

  public startFromDraft = () => {
    const { steps } = this.props
    if (steps.length) {
      this.setStep(steps[0].id)
    }
  }

  public setStep = (stepId: string) => {
    const {
      steps,
      stepId: fixedStepId,
      onStepChange,
      isSubmitting,
    } = this.props
    let stepIndex: number = -1

    if (isSubmitting) {
      return
    }

    const step = steps.find((stepItem, i) => {
      if (stepItem.id === stepId) {
        stepIndex = i
        return true
      }

      return false
    })

    if (onStepChange) {
      onStepChange(stepId)
    }

    if (!fixedStepId) {
      this.setState({
        stepIndex,
        stepId,
        step,
      })
    }
  }

  public back = () => {
    const { stepIndex } = this.state

    this.setStep(this.props.steps[stepIndex - 1].id)
  }

  public render() {
    const {
      header,
      context,
      steps,
      isSubmitting,
      className,
      mode,
      introduction: Introduction,
      conclusion: Conclusion,
      draftKey,
      skipingDisabled,
      children,
    } = this.props
    const {
      values,
      stepId,
      step,
      stepIndex,
      fetchingDraft,
      showDraftedIndicator,
      statusMessage,
      submitted,
      draftLoaded,
      submittedStepIds,
    } = this.state

    return (
      <FormComposerContext.Provider value={this.state}>
        <Container
          className={`composer-mode-${
            mode === FormComposerMode.EDIT ? 'edit' : 'new'
          }${className ? ` ${className}` : ''}`}
        >
          {statusMessage && (
            <Status className="animate-slideInUp">
              <div className="container ta-center">
                <span className="tc-white tw-medium">{statusMessage}</span>
              </div>
            </Status>
          )}
          <div className="container">
            {children}
            <Card className="card">
              {header === false
                ? null
                : header || (
                    <Header>
                      {draftKey && (
                        <DraftedIndicator
                          className={showDraftedIndicator ? 'active' : ''}
                        >
                          <ActivityIndicator
                            size={40}
                            fill="#fff"
                            className="mr-1"
                          />
                          Salvando rascunho
                        </DraftedIndicator>
                      )}
                      <StepsNav>
                        {steps.map(stepItem => (
                          <StepLink
                            key={stepItem.id}
                            className={`btn ${
                              stepId === stepItem.id ? 'active' : ''
                            }`}
                            onClick={
                              !skipingDisabled
                                ? () => this.setStep(stepItem.id)
                                : undefined
                            }
                          >
                            {stepItem.name}
                          </StepLink>
                        ))}
                      </StepsNav>
                      {mode !== FormComposerMode.EDIT && (
                        <Progress>
                          <ProgressValue
                            style={{
                              width: submitted
                                ? '100%'
                                : `${Math.max(
                                    0,
                                    Math.min(
                                      (submittedStepIds.length / steps.length) *
                                        100,
                                    ),
                                  )}%`,
                            }}
                          />
                        </Progress>
                      )}
                    </Header>
                  )}
              {submitted && Conclusion ? (
                <Conclusion formContext={context} values={values} />
              ) : stepId === StepIds.Introduction && Introduction ? (
                <Introduction
                  context={context}
                  fetchingDraft={fetchingDraft}
                  onStartFromDraft={
                    draftLoaded ? this.startFromDraft : undefined
                  }
                  onStart={this.start}
                  steps={steps}
                />
              ) : (
                step && (
                  <step.component
                    formContext={context}
                    mode={mode}
                    onBack={stepIndex !== 0 ? this.back : undefined}
                    onSubmit={value =>
                      this.handleStepSubmit(stepId as string, value)
                    }
                    onChange={value =>
                      this.handleStepChange(stepId as string, value)
                    }
                    defaultValue={values[stepId as string]}
                    isComposerSubmitting={isSubmitting}
                  />
                )
              )}
            </Card>
          </div>
        </Container>
      </FormComposerContext.Provider>
    )
  }
}

export default FormComposer
