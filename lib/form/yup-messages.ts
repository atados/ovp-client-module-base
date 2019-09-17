export const YupMessagesByLocale = {
  'pt-br': {
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
  },
  'er-as': {
    mixed: {
      required: 'Este campo es obligatorio',
      default: 'Inválido',
    },
    string: {
      min: 'Este campo debe contener al menos $ {min} caracteres',
      max: 'Este campo debe contener como máximo $ {max} caracteres',
      email: 'Este correo electrónico no es válido',
      url: 'Esta es una URL no válida. Intente agregar http: // al principio ',
    },
    array: {
      min: 'Debe contener al menos $ {min} elementos',
      max: 'Debe contener como máximo $ {max} artículos',
    },
    number: {
      isType: 'Este no es un número válido',
      min: 'El número debe ser como mínimo $ {min}',
      max: 'El número debe ser como máximo $ {max}',
    },
  },
  'en-us': {
    mixed: {
      required: 'This field is required',
      default: 'Invalid',
    },
    string: {
      min: 'This field must contain at least ${min} characters',
      max: 'This field must contain at most ${max} characters',
      email: 'This email is invalid',
      url: 'This a invalid URL. Try adding http:// at the start',
    },
    array: {
      min: 'Must contain at least ${min} items',
      max: 'Must contain at most ${max} items',
    },
    number: {
      isType: 'This is not a valid number',
      min: 'The number must be at minimum ${min}',
      max: 'The number must be at maximum ${max}',
    },
  },
}
