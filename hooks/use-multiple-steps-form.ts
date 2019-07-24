import { useContext } from 'react'
import MultipleStepsFormContext, {
  MultipleStepsFormContextType,
} from '~/components/MultipleStepsForm/MultipleStepsFormContext'

export default function useMultipleStepsForm<
  Value = any,
  Payload = any,
  Context = any
>(): MultipleStepsFormContextType<Value, Payload, Context> {
  const context = useContext(MultipleStepsFormContext)

  if (!context) {
    throw new Error('You must wrap this component with MultistepForm')
  }

  return context
}
