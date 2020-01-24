// tslint:disable no-console
import chalk from 'chalk'
import { rgbToHex, hexToRgb } from '../../lib/color/transformers'

const tint = (hex: string, intensity: number) => {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex(
    Math.round(r + (255 - r) * intensity),
    Math.round(g + (255 - g) * intensity),
    Math.round(b + (255 - b) * intensity),
  )
}

const shade = (hex: string, intensity: number) => {
  const [r, g, b] = hexToRgb(hex)

  return rgbToHex(
    Math.round(r * intensity),
    Math.round(g * intensity),
    Math.round(b * intensity),
  )
}

const tailwindTints = {
  100: 0.9,
  200: 0.75,
  300: 0.6,
  400: 0.3,
}

const tailwindShades = {
  600: 0.9,
  700: 0.6,
  800: 0.45,
  900: 0.3,
}

const value = process.argv[3]

function main() {
  if (!value) {
    throw new Error('You must provide a color. E.x.: yarn shade-color #333')
  }

  const color = value.startsWith('#') ? value : `#${value}`
  const themeColor = { 500: color }
  Object.keys(tailwindShades).map(level => {
    const intensity = tailwindShades[level]
    themeColor[level] = shade(color, intensity)
  })
  Object.keys(tailwindTints).map(level => {
    const intensity = tailwindTints[level]
    themeColor[level] = tint(color, intensity)
  })

  const text = chalk.rgb(181, 244, 165)
  console.log(chalk.gray('const app: Configuration = {'))
  console.log(chalk.gray('  theme: {'))
  console.log(chalk.gray('    color: {'))
  console.log(chalk.gray(`      ${text('"color-name"')}: {`))
  Object.keys(themeColor).forEach(key => {
    const rgb = hexToRgb(themeColor[key])
    console.log(
      `         ${text(`"${key}"`)}: ${text('"')}${chalk.rgb(...rgb)(
        `${themeColor[key]}`,
      )}${text('"')},`,
    )
  })
  console.log(chalk.gray('      }'))
  console.log(chalk.gray('    }'))
  console.log(chalk.gray('  }'))
  console.log('}')
}

export default main()
