const glob = require('glob')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')

const subdir = process.argv[2] || 'base'
function main() {
  glob(path.resolve(subdir, 'config', '**.{js,json}'), (error, matches) => {
    if (error) {
      console.error(error)
      process.exit(1)
    }

    matches.forEach(filepath => {
      const filename = path.basename(filepath)
      const newFilePath = path.resolve(filename)

      try {
        const stat = fs.statSync(newFilePath)

        if (stat.isDirectory()) {
          console.error(
            `> Failed to create '${chalk.cyan(
              filename,
            )}'. It already exists as a directory`,
          )
        } else {
          console.log(
            chalk.gray(
              `> Skipping ${chalk.cyan(filename)} since it already exists`,
            ),
          )
        }

        // Skip since the we shouldn't override the current content
        return
      } catch (error) {
        // File doesn't exist yet. Continue
      }

      if (filepath.endsWith('.js')) {
        console.log(`> Writing ${chalk.cyan(filename)}`)
        fs.writeFileSync(
          newFilePath,
          `module.exports = require('./${path.join(
            subdir,
            'config',
            filename,
          )}')`,
          'utf-8',
        )
      } else {
        console.log(`> Copying ${chalk.cyan(filename)}`)
        fs.copyFileSync(filepath, newFilePath)
      }
    })
  })
}

main()
