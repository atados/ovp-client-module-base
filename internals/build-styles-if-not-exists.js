const path = require('path')
const fs = require('fs')

module.exports = () => {
  fs.stat(path.resolve('.dist', 'static', 'index.css'), error => {
    // If the file doesn't exist, run gulp
    if (error) {
      console.log('> Running Gulp')
      require('child_process').exec('gulp', error => {
        if (error) {
          console.error(error)
          return
        }

        console.log('> Finished running Gulp')
      })
    }
  })
}
