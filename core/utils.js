const { promisify } = require('util')
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

const stat = promisify(fs.stat)

const writeIfNotExists = async (relFilePath, content) => {
  const chalk = require('chalk')
  const createDir = promisify(require('mkdirp'))

  return await stat(path.resolve(relFilePath))
    .then(() => {
      console.log(
        chalk.gray(`> Pulando ${chalk.cyan(relFilePath)} porque já existe`),
      )
    })
    .catch(async () => {
      await createDir(path.resolve(path.dirname(relFilePath)))
      console.log(`> Criando ${chalk.cyan(relFilePath)}`)
      await write(path.resolve(relFilePath), content, 'utf8')
    })
}

function execAsync(cmd, args, options) {
  return new Promise((resolve, reject) => {
    const cp = spawn(cmd, args, {
      stdio: 'inherit',
      cwd: path.resolve(),
      ...options,
    })
    let resolved = false
    cp.on('error', error => {
      if (resolved) {
        return
      }

      resolved = true
      reject(error)
    })

    cp.on('exit', code => {
      if (resolved) {
        return
      }

      resolved = true

      if (code === '1') {
        reject(code)
      } else {
        resolve(code)
      }
    })
  })
}

module.exports = {
  writeIfNotExists,
  execAsync,
}
