import { Request } from 'express'
import { DocumetNode } from 'graphql'
import { Strategy as LocalStrategy } from 'passport-local'

declare module '*.json'
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export interface ColorMap {
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
}
