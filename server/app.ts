import * as bodyParser from 'body-parser'
import * as express from 'express'
import { resolve } from 'path'
import { dev } from '~/common/constants'
import setupAuthentication from '~/server/authentication/setup'
import setupChannel from './channel/setup'
import { STATIC_DIST_DIRNAME } from './constants'
import setupGeolocation from './geo/setup'
import setupIntl from './intl/setup'
import setupSession from './session/setup'

const server = express()

const staticServingOptions = dev
  ? {}
  : {
      maxAge: 31536000000,
      immutable: true,
    }
server.use(
  '/base',
  express.static(resolve('base', 'static'), staticServingOptions),
)
server.use(
  `/_static/${STATIC_DIST_DIRNAME}`,
  express.static(resolve('.dist', 'static'), staticServingOptions),
)
server.use(express.static(resolve('static'), staticServingOptions))

// Body parser
server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())

setupSession(server)
setupAuthentication(server)
setupChannel(server)
setupIntl(server)
setupGeolocation(server)

export default server
