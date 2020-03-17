const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const { writeIfNotExists, execAsync } = require('../utils')

const channelId = process.argv[2]
const copy = promisify(fs.copyFile)

const configDir = path.join('base', 'core', 'config')

async function main() {
  if (!channelId) {
    console.log('Use `node base/setup.js <channel-id>`')
    process.exit(1)
  }

  console.log('> Copiando o package.json')
  await copy(
    path.resolve(configDir, 'package.json'),
    path.resolve('package.json'),
  )
  console.log('> Instalando dependências...')
  await execAsync('yarn', [])
  console.log('> Executando sincronização de configurações...')
  await execAsync('yarn', ['sync'])

  const { format } = require('prettier')
  const formatConfig = require(path.resolve('.prettierrc'))
  await writeIfNotExists(
    'channel/app.ts',
    format(
      `
    import { Configuration, ValidBasePageName } from '~/app/config'

    // Defina aqui os nomes das páginas do canal
    // e.x.: = 'About' | 'Contact'
    export type ValidPageName = ValidBasePageName

    const app: Configuration = {
      id: "${channelId}",
    }

    export default app
  `,
      {
        ...formatConfig,
        parser: 'typescript',
      },
    ),
  )
  await writeIfNotExists(
    'now.json',
    JSON.stringify(
      {
        name: channelId,
        version: 2,
        regions: ['gru1'],
        build: {
          env: {
            API_URL: 'https://api.beta.atados.com.br',
            APP_URL: `https://${channelId}-staging.atados.now.sh`,
            APP_SHARE_URL: `http://${channelId}-staging.atados.now.sh`,
            AUTH_CLIENT_ID: 'x4FR4jyyuVXvuHMiZiflT7y9l2o15MYJjiHqLUmP',
            AUTH_CLIENT_SECRET:
              'JhK5yjm0XLQx7rH1dygobly3cSx5cIEGJYaGQTRhhEYzx6T4wZ2RqYn1sLKoMiXN5233CgmDeLurgl6YHPrBP2wDdg2VteOyOrlXhHWjU5nvGWw3YQi8zqTgyvK3BZ3b',
          },
        },
      },
      null,
      2,
    ),
  )
  await writeIfNotExists(
    'now.production.json',
    JSON.stringify(
      {
        name: channelId,
        version: 2,
        regions: ['gru1'],
        build: {
          env: {
            API_URL: 'https://api.beta.atados.com.br',
            APP_URL: `https://${channelId}-staging.atados.now.sh`,
            APP_SHARE_URL: `http://${channelId}-staging.atados.now.sh`,
            AUTH_CLIENT_ID: 'x4FR4jyyuVXvuHMiZiflT7y9l2o15MYJjiHqLUmP',
            AUTH_CLIENT_SECRET:
              'JhK5yjm0XLQx7rH1dygobly3cSx5cIEGJYaGQTRhhEYzx6T4wZ2RqYn1sLKoMiXN5233CgmDeLurgl6YHPrBP2wDdg2VteOyOrlXhHWjU5nvGWw3YQi8zqTgyvK3BZ3b',
          },
        },
      },
      null,
      2,
    ),
  )
}

module.exports = main().catch(error => {
  console.error(error)
  process.exit(1)
})
