import * as Yup from 'yup'

Yup.addMethod(
  Yup.string,
  'equals',
  (key: string, message: string, func?: any) => {
    message = message || 'Values do not match'
    func =
      func ||
      function(value) {
        return value === this.options.parent[key]
      }

    return Yup.string().test('match', message, func)
  },
)

// It also support functions, so we can use intl later
Yup.setLocale({
  mixed: {
    required: 'Esse campo é obrigatório',
    default: 'Não é válido',
  },
  string: {
    min: 'Deve conter no mínimo ${min} caracteres',
    max: 'Deve conter no máximo ${max} caracteres',
    email: 'Certifique-se que esse é um email válido',
    url: 'Essa não é uma url válida',
  },
  array: {
    min: 'Deve conter no mínimo ${min} items',
    max: 'Deve conter no máximo ${max} items',
  },
  number: {
    isType: 'Esse não é um número válido',
    min: 'O número deve ser no mínimo ${min}',
    max: 'O número deve ser no máximo ${max}',
  },
})

export default Yup
