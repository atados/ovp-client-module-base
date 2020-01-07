const { screens, colors: tailwindColors } = require('tailwindcss/defaultTheme')
const { theme } = require('../../channel.json')
const variables = {
  toolbarHeight: '100px',
}

Object.keys(screens).forEach(breakpointName => {
  variables[`breakpoint-${breakpointName}`] = screens[breakpointName]
})

const setColorVariable = (name, colorDict) =>
  Object.keys(colorDict).forEach(key => {
    variables[`color-${name}-${key}`] = colorDict[key]
  })

Object.keys(theme.color).forEach(colorName => {
  setColorVariable(colorName, theme.color[colorName])
})
setColorVariable('red', tailwindColors.red)

module.exports = variables
