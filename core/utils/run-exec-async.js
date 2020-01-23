const { spawn } = require('child_process')
const path = require('path')
module.exports = function exec(cmd, args, options) {
  return new Promise((resolve, reject) => {
    const cp = spawn(cmd, args, {
      stdio: 'inherit',
      cwd: path.resolve(),
      ...options,
    })
    cp.on('exit', code => {
      if (code === '1') {
        reject(code)
      } else {
        resolve(code)
      }
    })
  })
}
