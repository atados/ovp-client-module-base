const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const exec = require('../utils/run-exec-async')

const channelId = process.argv[2]
const copy = promisify(fs.copyFile)
const write = promisify(fs.writeFile)
const createDir = promisify(fs.mkdir)

async function main() {
  if (!channelId) {
    console.log('Use `node base/setup.js <channel-id>`')
    process.exit(1)
  }

  console.log('> Copying package.json')
  await copy(
    path.resolve('base', 'config', 'package.json'),
    path.resolve('package.json'),
  )
  console.log('> Installing dependencies...')
  await exec('yarn', [])
  console.log('> Running synchronization...')
  await exec('yarn', ['sync'])

  try {
    fs.statSync(path.resolve('.now'))
    console.log('> Skipping creating .now because it already exists')
    return
  } catch (error) {}

  await createDir(path.resolve('.now'))
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
}

module.exports = main()
