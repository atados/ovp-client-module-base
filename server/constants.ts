// @ts-ignore
import * as nanoid from 'nanoid'
import getConfig from 'next/config'

export const {
  serverRuntimeConfig: { staticDistDirname: STATIC_DIST_DIRNAME },
} = getConfig()

export const {
  SESSION_KEY = nanoid(),
  SESSION_SECRET = nanoid(),
  AUTH_GOOGLE_ID,
  AUTH_GOOGLE_SECRET,
  AUTH_FACEBOOK_ID,
  AUTH_FACEBOOK_SECRET,
  AUTH_CLIENT_ID,
  AUTH_CLIENT_SECRET,
} = process.env
