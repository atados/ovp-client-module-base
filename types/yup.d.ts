import { StringSchema } from 'yup'

declare module 'yup' {
  interface StringSchema {
    equals(key: string, message?: string, func?: any): StringSchema
    isValidChannelEmail(message?: string): StringSchema
  }
}
