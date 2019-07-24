import React, { useCallback, useEffect, useMemo, useState } from 'react'
import MultipleStepsFormContext, {
  MultipleStepsFormContextType,
  MultpleStepsFormStep,
} from './MultipleStepsFormContext'

interface OnStepSubmitContext {
  readonly steps: MultpleStepsFormStep[]
  readonly currentStepId?: string
  readonly submit: () => void
  readonly setCurrentStepId: (stepId: string) => void
  readonly isSubmitting?: boolean
}

interface OnSubmitContext {
  readonly setCurrentStepId: (id: string) => void
}

interface MultipleStepsFormProps {
  readonly className?: string
  readonly context?: any
  readonly stepId?: string
  readonly defaultValue?: any
  readonly onSubmit: (value: any, context: OnSubmitContext) => any
  readonly onStepSubmit?: (
    stepId: string,
    value: any,
    context: OnStepSubmitContext,
  ) => void
  readonly onStepIdChange?: (stepId: string) => void
}

interface MultpleStepsFormState {
  readonly steps: MultpleStepsFormStep[]
  readonly currentStepId?: string
  readonly value: any
  readonly payload?: any
  readonly isSubmitting?: boolean
  readonly submitted?: boolean
  readonly failedToSubmit?: boolean
}

const MultipleStepsForm: React.FC<MultipleStepsFormProps> = ({
  context,
  children,
  stepId: fixedStepId,
  defaultValue,
  onSubmit,
  onStepIdChange,
  onStepSubmit,
}) => {
  const [state, setState] = useState<MultpleStepsFormState>({
    steps: [],
    currentStepId: fixedStepId,
    value: defaultValue,
  })

  const setCurrentStepId = useCallback(
    newStepId => {
      if (newStepId !== state.currentStepId) {
        if (onStepIdChange) {
          onStepIdChange(newStepId)
        }

        if (fixedStepId !== undefined) {
          return
        }

        setState(currentState => ({
          ...currentState,
          currentStepId: newStepId,
        }))
      }
    },
    [state],
  )
  const submit = useCallback(
    async (newValue: any) => {
      try {
        setState(currentState => ({
          ...currentState,
          isSubmitting: true,
          payload,
          failedToSubmit: payload instanceof Error,
        }))
        const payload = await onSubmit(newValue, { setCurrentStepId })

        setState(currentState => ({
          ...currentState,
          isSubmitting: false,
          payload,
          submitted: true,
          failedToSubmit: payload instanceof Error,
        }))
      } catch (error) {
        setState(currentState => ({
          ...currentState,
          isSubmitting: false,
          payload: error,
          submitted: true,
          failedToSubmit: true,
        }))
      }
    },
    [onSubmit],
  )

  useEffect(() => {
    if (state.currentStepId !== fixedStepId) {
      setState(currentState => ({
        ...currentState,
        currentStepId: fixedStepId,
      }))
    }
  }, [fixedStepId])

  const contextValue: MultipleStepsFormContextType<any, any, any> = useMemo(
    () => ({
      register: (id: string, options: any) => {
        setState(currentState => ({
          ...currentState,
          steps: [
            ...currentState.steps,
            {
              id,
              options,
              done:
                options && options.isDone
                  ? options.isDone(currentState.value)
                  : false,
            },
          ],
        }))

        return () => {
          setState(currentState => ({
            ...currentState,
            steps: currentState.steps.filter(step => step.id !== id),
          }))
        }
      },
      setCurrentStepId,
      steps: state.steps,
      context,
      currentStepId: state.currentStepId,
      value: state.value,
      payload: state.payload,
      failedToSubmit: state.failedToSubmit,
      submitted: state.submitted,
      isSubmitting: state.isSubmitting,
      submit: (stepId: string, mergeValues: (value: any) => any) => {
        setState(currentState => {
          const newValue = mergeValues(currentState.value)
          const newSteps = currentState.steps.map(step => {
            if (step.id === stepId) {
              return {
                ...step,
                submitted: true,
                done:
                  step.options && step.options.isDone
                    ? step.options.isDone(newValue)
                    : true,
              }
            }

            return step
          })

          if (onStepSubmit) {
            setTimeout(
              () =>
                onStepSubmit(stepId, newValue, {
                  isSubmitting: state.isSubmitting,
                  steps: newSteps,
                  currentStepId: currentState.currentStepId,
                  setCurrentStepId,
                  submit: () => submit(newValue),
                }),
              1,
            )
          }

          return {
            ...currentState,
            value: newValue,
            steps: newSteps,
          }
        })
      },
    }),
    [context, state],
  )

  return (
    <MultipleStepsFormContext.Provider value={contextValue}>
      {children}
    </MultipleStepsFormContext.Provider>
  )
}

MultipleStepsForm.displayName = 'MultipleStepsForm'

export default MultipleStepsForm
