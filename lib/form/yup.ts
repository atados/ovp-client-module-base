import * as Yup from 'yup'

export interface YupErrorTranslated {
  message: string
  translated?: true
  values: { [key: string]: any }
}

export interface YupErrorTranslatable {
  code: string
  message: string
  translated?: false
  values: { [key: string]: any }
}

export type YupError = YupErrorTranslated | YupErrorTranslatable

Yup.addMethod(
  Yup.string,
  'equals',
  (key: string, message?: string, func?: any) => {
    message = message || 'Values do not match'
    func =
      func ||
      function(value) {
        return value === this.options.parent[key]
      }

    return Yup.string().test(
      'match',
      () => ({ code: 'equals', message, values: { fieldName: key } }),
      func,
    )
  },
)

export const YupDateErrorMessage = () => ({
  code: 'invalid_date',
  message: 'Esta data não é valida',
  values: {},
})
export const YupHourErrorMessage = (): YupError => ({
  code: 'invalid_hour',
  message: 'Esta hora não é valida',
  values: {},
})
export const YupPhoneErrorMessage = (): YupError => ({
  code: 'invalid_phone',
  message: 'Este número de telefone não é válido',
  values: {},
})

Yup.setLocale({
  mixed: {
    required: (): YupError => ({
      code: 'required',
      message: 'Esse campo é obrigatório',
      values: {},
    }),
    default: (): YupError => ({
      code: 'invalid',
      message: 'Esse tipo não é valido',
      values: {},
    }),
  },
  string: {
    // @ts-ignore
    equals: ({ min }): YupError => ({
      code: 'equals',
      message: 'Os valores não iguais',
      values: { min },
    }),
    min: ({ min }): YupError => ({
      code: 'string_min',
      message: `Deve conter no mínimo ${min} caracteres`,
      values: { min },
    }),
    max: ({ max }): YupError => ({
      code: 'string_max',
      message: `Deve conter no máximo ${max} caracteres`,
      values: { max },
    }),
    email: (): YupError => ({
      code: 'string_email',
      message: 'Certifique-se que esse é um email válido',
      values: {},
    }),
    url: (): YupError => ({
      code: 'string_url',
      message: 'Essa não é uma url válida',
      values: {},
    }),
  },
  array: {
    min: ({ min }): YupError => ({
      code: 'array_min',
      message: `Esta lista conter no mínimo ${min} items`,
      values: { min },
    }),
    max: ({ max }): YupError => ({
      code: 'array_max',
      message: `Esta lista conter no máximo ${max} items`,
      values: { max },
    }),
  },
  number: {
    min: ({ min }): YupError => ({
      code: 'number_min',
      message: `O número deve ser no mínimo ${min}`,
      values: { min },
    }),
    max: ({ max }): YupError => ({
      code: 'number_max',
      message: `O número deve ser no máximo ${max}`,
      values: { max },
    }),
  },
})
export default Yup
