const { screens } = require('tailwindcss/defaultTheme')
const purgecss = require('@fullhuman/postcss-purgecss')({
  // Specify the paths to all of the template files in your project
  content: [
    './base/**/*.ts',
    './channel/**/*.ts',
    './base/**/*.tsx',
    './channel/**/*.tsx',
    // etc.
  ],

  // Include any special characters you're using in this regular expression
  defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
})

const customMedia = {}

Object.keys(screens).forEach(screenName => {
  customMedia[`--min-${screenName}`] = `(min-width: ${screens[screenName]})`
  customMedia[`--max-${screenName}`] = `(max-width: ${screens[screenName]})`
})

const useTailwind = Boolean(process.env.TAILWIND)
const prod = process.env.NODE_ENV === 'production'
module.exports = {
  plugins: [
    ...(useTailwind ? [require('postcss-import'), require('tailwindcss')] : []),
    require('postcss-nested'),
    require('postcss-custom-media')({
      importFrom: [{ customMedia }],
    }),
    require('autoprefixer'),
    ...(prod ? [purgecss, require('cssnano')] : []),
  ],
}
