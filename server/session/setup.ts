import * as connectRedis from 'connect-redis'
import * as cookieParser from 'cookie-parser'
import { Express } from 'express'
import * as expressSession from 'express-session'
import { dev } from '~/common/constants'
import { SESSION_KEY, SESSION_SECRET } from '~/server/constants'

export default (server: Express) => {
  let store

  if (!dev) {
    const RedisStore = connectRedis(expressSession)
    store = new RedisStore()
  }

  // Session
  server.use(
    expressSession({
      store,
      name: SESSION_KEY,
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      },
    }),
  )

  // Cookie parser
  server.use(cookieParser())
}
