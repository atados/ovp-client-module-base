import { ValidPageName as TValidPageName } from '~/app'
import * as APIEndpoint from './api-endpoints'

export * from './page'
export * from '~/common/config'
export { Page, PageAs } from '~/common/page'
export * from '~/common/intl-messages'
export type ValidPageName = TValidPageName
export { APIEndpoint }
