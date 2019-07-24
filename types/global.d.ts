import { Request } from 'express'
import { DocumetNode } from 'graphql'
import { Strategy as LocalStrategy } from 'passport-local'

declare module '*.json'
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
