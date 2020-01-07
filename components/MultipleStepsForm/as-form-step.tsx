import { useCallback, useEffect } from 'react'
import { Omit } from 'react-redux'
import useMultipleStepsForm from '~/hooks/use-multiple-steps-form'
import { MultipleStepsFormContextType } from './MultipleStepsFormContext'

export interface InjectedMultipleStepsFormProps<Value, Payload, Context>
  extends Omit<
    MultipleStepsFormContextType<Value, Payload, Context>,
    'submit' | 'register' | 'context' | 'isSubmitting'
  > {
  onSubmit: (mergeValues: (value: Value) => Value) => any
  formContext: Context
  isFormSubmitting: boolean
}

interface Options<Value> {
  isDone?: (value: Value) => boolean
}

export default function asFormStep<
  Value,
  Props extends InjectedMultipleStepsFormProps<Value, any, any>
>(
  id: string,
  options: Options<Value> & { [key: string]: any },
  Component: React.ComponentType<any>,
) {
  const WrapperComponent: React.FC<Omit<
    Props,
    keyof InjectedMultipleStepsFormProps<any, any, any>
  >> = props => {
    const {
      submit,
      register,
      context,
      isSubmitting,
      ...contextProps
    } = useMultipleStepsForm()
    useEffect(() => register(id, options), [])
    const handleSubmit = useCallback(
      mergeValues => {
        submit(id, mergeValues)
      },
      [submit],
    )

    if (contextProps.currentStepId !== id) {
      return null
    }

    return (
      // @ts-ignore
      <Component
        {...props}
        {...contextProps}
        isFormSubmitting={isSubmitting}
        formContext={context}
        onSubmit={handleSubmit}
      />
    )
  }

  return WrapperComponent
}
