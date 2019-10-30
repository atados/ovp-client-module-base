import React, { useEffect } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { YupError } from '~/lib/form/yup'
import { reportError } from '~/base/lib/utils/error'

const m = defineMessages({
  required: {
    id: 'form.error.required',
    defaultMessage: 'Esse campo é obrigatório',
  },
  invalid: {
    id: 'form.error.invalid',
    defaultMessage: 'Esse tipo não é valido',
  },
  string_min: {
    id: 'form.error.string_min',
    defaultMessage: 'Deve deve conter no mínimo {min} caracteres',
  },
  string_max: {
    id: 'form.error.string_max',
    defaultMessage: 'Deve deve conter no máximo {max} caracteres',
  },
  string_email: {
    id: 'form.error.string_email',
    defaultMessage: 'Certifique-se que esse é um email válido',
  },
  string_url: {
    id: 'form.error.string_url',
    defaultMessage: 'Essa não é uma url válida',
  },
  array_min: {
    id: 'form.error.array_min',
    defaultMessage: 'Esta lista conter no mínimo {min} items',
  },
  array_max: {
    id: 'form.error.array_max',
    defaultMessage: 'Esta lista conter no máximo {max} items',
  },
  number_min: {
    id: 'form.error.number_min',
    defaultMessage: 'O número deve ser no mínimo {min}',
  },
  number_max: {
    id: 'form.error.number_max',
    defaultMessage: 'O número deve ser no máximo {max}',
  },
  unknown: {
    id: 'form.error.unknown',
    defaultMessage: 'Campo inválido',
  },
  equals: {
    id: 'form.error.equals',
    defaultMessage: 'Os valores não são iguais',
  },
  invalid_phone: {
    id: 'form.error.invalid_phone',
    defaultMessage: 'Este telefone não é válido',
  },
  invalid_date: {
    id: 'form.error.invalid_date',
    defaultMessage: 'Esta data não é valida',
  },
  invalid_hour: {
    id: 'form.error.invalid_hour',
    defaultMessage: 'Esta hora não é válida',
  },
  terms: {
    id: 'form.error.terms',
    defaultMessage: 'Você deve aceitar os termos para prosseguir',
  },
})

interface FormErrorMessageProps {
  readonly className?: string
  readonly error: string | YupError
}

const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ error }) => {
  const intl = useIntl()
  const isString = typeof error === 'string'
  const errorCode = isString ? undefined : (error as YupError).code

  useEffect(() => {
    let reportedError
    if (isString) {
      reportedError = new Error(
        `Yup error as string "${error}" is not translated`,
      )
    }

    if (errorCode && !m[errorCode]) {
      reportedError = new Error(
        `Yup error with code '${errorCode}' is not translated`,
      )
    }

    if (reportedError) {
      reportedError.name = 'YupTranslationError'
      reportError(reportedError)
    }
  }, [isString ? error : (error as YupError).code])

  if (isString) {
    return <>{error}</>
  }

  return (
    <>
      {intl.formatMessage(
        m[errorCode as any] || m.unknown,
        (error as YupError).values,
      )}
    </>
  )
}

FormErrorMessage.displayName = 'FormErrorMessage'

export default FormErrorMessage
