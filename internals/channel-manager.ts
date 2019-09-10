// tslint:disable:no-console

import chalk from 'chalk'
import path from 'path'
import { rgbToHex, hexToRgb } from '../lib/color/transformers'
import prevChannel from '../../channel.json'
import * as fs from 'fs'
import { promisify } from 'util'

const writeFile = promisify(fs.writeFile)

const help = `
Usage: yarn channel <command>

where <command> is one of:
  set

yarn channel ${chalk.cyan('set')} <config-key> <value>

${chalk.bold('Examples:')}
yarn channel set color.primary #333
yarn channel set color.secondary #333
`

const dir = path.resolve()
const required = (command: string, key: string) => {
  throw new Error(`Command \`${command}\` requires you to provide a \`${key}\``)
}

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

function set(
  key: string = required('set', 'key'),
  value: string = required('set', 'value'),
) {
  const pieces = key.split('.')

  if (pieces[0] === 'color') {
    const [, colorName] = pieces

    if (!colorName) {
      console.error('Missing [color-name]')
      return process.exit(1)
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

    const channel = {
      ...prevChannel,
      theme: {
        ...(prevChannel as any).theme,
        color: {
          ...(prevChannel as any).theme.color,
          [colorName]: themeColor,
        },
      },
    }

    return writeFile(
      path.resolve('channel.json'),
      JSON.stringify(channel, null, 2),
    )
  }
}

export default function() {
  if (!process.argv[1]) {
    console.log(help)
    process.exit(1)
    return
  }

  const action = process.argv[1].substr(dir.length + 1)
  const args = process.argv.slice(2)

  if (action === 'set') {
    set(...args)
    return
  }

  console.log('This command is not supported\n\t')
  process.exit(1)
}
