import { Express } from 'express'
import createUser from '~/server/authentication/create-user'
import passport from '~/server/authentication/passport'

export default (server: Express) => {
  server.use(passport.initialize())
  server.use(passport.session())

  server
    .get('/sair', (req, res) => {
      req.logout()
      res.redirect(req.query.next || '/')
    })

    .get('/auth/facebook', (req, res, next) => {
      if (req.query.next && req.session) {
        req.session.authSuccessRedirect = req.query.next
      }

      passport.authenticate('facebook', {
        scope: ['email'],
      })(req, res, next)
    })

    .get('/auth/facebook/return', (req, res, next) => {
      let successRedirect = '/'

      if (req.session && req.session.authSuccessRedirect) {
        successRedirect = req.session.authSuccessRedirect
        delete req.session.authSuccessRedirect
      }

      passport.authenticate('facebook', {
        successRedirect,
        failureRedirect: `/entrar?failed=1&next=${successRedirect}`,
      })(req, res, next)
    })

    .get('/auth/google', (req, res, next) => {
      if (req.query.next && req.session) {
        req.session.redirectToAfterLogin = req.query.next
      }

      passport.authenticate('google', {
        scope: ['profile', 'email'],
      })(req, res, next)
    })

    .get('/auth/google/return', (req, res, next) => {
      let redirectTo = '/'

      if (req.session && req.session.redirectToAfterLogin) {
        redirectTo = req.session.redirectToAfterLogin
        delete req.session.redirectToAfterLogin
      }

      passport.authenticate('google', {
        failureRedirect: `/entrar?failed=2&next=${redirectTo}`,
        successRedirect: redirectTo,
      })(req, res, next)
    })

    .post('/auth/email', (req, res, next) => {
      passport.authenticate('local', {
        failureRedirect: `/entrar?failed=2&next=${req.query.next || '/'}`,
        successRedirect: req.query.next,
      })(req, res, next)
    })

    .post('/auth/email/register', async (req, res, next) => {
      const { next: redirectTo = '/' } = req.query

      try {
        await createUser(req)

        passport.authenticate('local', {
          failureRedirect: `/entrar?failed=2&next=${redirectTo}`,
          successRedirect: `${redirectTo}?registered=1`,
        })(req, res, next)
      } catch (error) {
        res.redirect(`/entrar/cadastro?failed=${error.code}&next=${redirectTo}`)
      }
    })
}
