import React from 'react'

export interface MultpleStepsFormStep {
  readonly id: string
  readonly submitted?: boolean
  readonly done?: boolean
  readonly options?: any
}

export interface MultipleStepsFormContextType<
  ValueType,
  PayloadType,
  ContextType
> {
  readonly value: ValueType
  readonly context: ContextType
  readonly steps: MultpleStepsFormStep[]
  readonly currentStepId?: string
  readonly isSubmitting?: boolean
  readonly submitted?: boolean
  readonly failedToSubmit?: boolean
  readonly payload?: PayloadType | Error
  readonly setCurrentStepId: (id: string) => void
  readonly submit: (
    id: string,
    mergeValues: (value: ValueType) => ValueType,
  ) => void

  register(id: string, options?: any): () => void
}

export default React.createContext<MultipleStepsFormContextType<
  any,
  any,
  any
> | null>(null)
