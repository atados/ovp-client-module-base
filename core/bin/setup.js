const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const exec = require('../utils/run-exec-async')

const channelId = process.argv[2]
const copy = promisify(fs.copyFile)
const write = promisify(fs.writeFile)
const stat = promisify(fs.stat)
const createDir = promisify(require('mkdirp'))

const configDir = path.join('base', 'core', 'config')
async function main() {
  if (!channelId) {
    console.log('Use `node base/setup.js <channel-id>`')
    process.exit(1)
  }

  console.log('> Copying package.json')
  await copy(
    path.resolve(configDir, 'package.json'),
    path.resolve('package.json'),
  )
  console.log('> Installing dependencies...')
  await exec('yarn', [])
  console.log('> Running synchronization...')
  await exec('yarn', ['sync'])

  const chalk = require('chalk')
  const { format } = require('prettier')
  const formatConfig = require(path.resolve('.prettierrc'))
  await stat(path.resolve('channel/app.ts'))
    .then(() => {
      console.log(
        chalk.gray(
          `> Skipping creating ${chalk.cyan(
            'channel/app.ts',
          )} because it already exists`,
        ),
      )
    })
    .catch(async () => {
      console.log(`> Writing ${chalk.cyan(path.join('channel/app.ts'))}`)
      await createDir(path.resolve('channel'))
      await write(
        path.resolve('channel/app.ts'),
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
    })

  await stat(path.resolve('.now'))
    .then(() => {
      console.log(
        chalk.gray(
          `> Skipping creating ${chalk.cyan('.now')} because it already exists`,
        ),
      )
    })
    .catch(async () => {
      await createDir(path.resolve('.now'))
      console.log(chalk.gray(`> Writing ${chalk.cyan('.now')} directory`))
      await write(
        path.resolve('.now', 'now.staging.json'),
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
      await write(
        path.resolve('.now', 'now.production.json'),
        JSON.stringify(
          {
            name: channelId,
            version: 2,
            regions: ['gru1'],
            build: {
              env: {
                API_URL: 'https://api.beta.atados.com.br',
                APP_URL: `https://${channelId}.atados.now.sh`,
                APP_SHARE_URL: `http://${channelId}.atados.now.sh`,
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
    })
}

module.exports = main().catch(error => {
  console.error(error)
  process.exit(1)
})
