import * as next from 'next'
import { channel, dev } from '~/common/constants'
import server from '~/server/app'
import setupRoutes from '~/server/routes'
import { ChannelRequest } from './channel/setup'
import './core/setup'

export default function runServer() {
  const port = process.env.PORT || 3000
  const listen = () =>
    server.listen(port, () =>
      console.info(`> Ready on http://localhost:${port}`),
    )

  if (!process.env.DISABLE_NEXT) {
    const app = next({ dev, quiet: true })
    const handle = app.getRequestHandler()

    // Define routes
    setupRoutes(app, server)

    // Handle get request with next request handler
    server.get('*', (req, res) => handle(req, res))

    app.prepare().then(listen)
  } else {
    server.get('/', (req: ChannelRequest, res) =>
      res.json({
        startupData: req.startupData,
        channel,
      }),
    )

    // Define routes
    setupRoutes(null, server)

    listen()
  }
}
