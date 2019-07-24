import { range } from '../utils/array'

export const companyRegistrationId = [
  /\d/,
  /\d/,
  '.',
  /\d/,
  /\d/,
  /\d/,
  '.',
  /\d/,
  /\d/,
  /\d/,
  '/',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
]

export const numeral = value =>
  value ? range(value.replace(/\D/g, '').length, () => /\d/) : [/\d/]

export const phone = value => {
  const numbers = value.match(/\d/g)
  let numberLength = 0
  if (numbers) {
    numberLength = numbers.join('').length
  }

  if (numberLength > 10) {
    return [
      '(',
      /[1-9]/,
      /[1-9]/,
      ')',
      ' ',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ]
  }

  return [
    '(',
    /[1-9]/,
    /[1-9]/,
    ')',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ]
}

export const hour = value => {
  let hourRegex = /[0-9]/
  if (value[0] === '2') {
    hourRegex = /[0-3]/
  }

  return [/[0-2]/, hourRegex, ':', /[0-5]/, /\d/]
}
export const date = value => {
  let daySecondNumber = /\d/
  let monthSecondNumber = /\d/

  if (value.startsWith('3')) {
    daySecondNumber = /[0-1]/
  }

  if (/^\d\d\/1/.test(value)) {
    monthSecondNumber = /[0-2]/
  }

  return [
    /[0-3]/,
    daySecondNumber,
    '/',
    /[0-1]/,
    monthSecondNumber,
    '/',
    /[0-2]/,
    /\d/,
    /\d/,
    /\d/,
  ]
}
