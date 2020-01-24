import { AppConfiguration } from '~/app/config'
import baseAppConfig from '../app'
import channelAppConfig, { ValidPageName } from '~/app'
import deepExtend from 'deep-extend'

const config: AppConfiguration<ValidPageName> = deepExtend(
  baseAppConfig,
  channelAppConfig,
)
export const CHANNEL_ID = config.id
export const Config = config
export const Asset = config.assets
export const Theme = config.theme
export const Color = config.theme.color
