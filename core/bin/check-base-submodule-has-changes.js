const path = require('path')
const chalk = require('chalk')
const { exec } = require('child_process')
const { promisify } = require('util')

const execAsync = promisify(exec)

async function run() {
  const { stdout } = await execAsync(
    'git submodule foreach -q git status --porcelain',
    {
      cwd: path.resolve(),
    },
  )

  if (stdout) {
    throw new Error('Base submodule has uncommited changes')
  }
}

run().catch(error => {
  console.log(error)
  console.log(chalk.red("Error: 'base/' submodule has uncommited changes."))
  process.exit(1)
})
