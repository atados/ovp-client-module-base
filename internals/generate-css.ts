import { Channel } from '../redux/ducks/channel'
import * as path from 'path'
import { rgba, shade } from '../lib/color/transformers'
import loadChannelConfig from './channel/load-channel-config'
import { ColorMap } from '../types/global'
import cssnano from 'cssnano'
import postcss from 'postcss'
import mkdirp from 'mkdirp'
import * as fs from 'fs'
import { promisify } from 'util'

const mkdirpAsync = promisify(mkdirp)
const writeFile = promisify(fs.writeFile)

const generateCSSWithColorMap = (
  colorMap: ColorMap,
  selector: string,
  property: string,
  modifier: string = '',
) => {
  return Object.keys(colorMap)
    .map(
      intensity => `${selector}-${intensity}${modifier} {
  ${property}: ${colorMap[intensity]} !important;
}`,
    )
    .join('\n\n')
}

const colorsCache = {}

export const generateButtonCSS = (
  selectors: string[],
  background: string,
  color: string = '#fff',
) => {
  if (!colorsCache[background]) {
    colorsCache[background] = {
      shadow: rgba(background, 50),
      '-5': shade(background, -5),
      '-8': shade(background, -8),
    }
  }

  if (!colorsCache[background]['-12']) {
    colorsCache[background]['-12'] = shade(background, -12)
  }

  const colorMap = colorsCache[background]

  return `
    ${selectors} {
      color: ${color};
      background-color: ${background};
      border-color: ${background};
    }

    ${selectors.map(selector => `${selector}:hover`)} {
      color: ${color};
      background-color: ${colorMap['-5']};
      border-color: ${colorMap['-8']};
    }

    ${selectors.map(selector => `${selector}:disabled`)} {
      background-color: ${background};
      border-color: ${background};
    }

    ${
      colorMap.shadow
        ? `
        ${selectors.map(selector => `${selector}:focus`)}{
        box-shadow: 0 0 0 3px ${colorMap.shadow};
      }
    `
        : ''
    }

    ${selectors.map(selector => `${selector}:active`)} {
      color: ${color};
      background-color: ${colorMap['-12']};
      background-image: none;
      border-color: ${colorMap['-8']};
    }
    `
}

export const generateButtonOutlineCSS = (
  selectors: string[],
  color: string,
) => {
  if (!colorsCache[color]) {
    colorsCache[color] = {
      shadow: rgba(color, 50),
      '-5': shade(color, -5),
      '-8': shade(color, -8),
    }
  }

  if (!colorsCache[color]['rgba.10']) {
    colorsCache[color]['rgba.10'] = rgba(color, 10)
  }

  const colorMap = colorsCache[color]

  return `
    ${selectors} {
      color: ${color};
      background-color: transparent;
      background-image: none;
      border-color: ${color};
    }

    ${selectors.map(selector => `${selector}:hover`)} {
      color: ${color};
      border-color: ${colorMap['-8']};
      background: ${colorMap['rgba.10']};
    }


    ${selectors.map(selector => `${selector}:focus`)} {
      box-shadow: 0 0 0 3px ${colorMap.shadow};
    }


    ${selectors.map(selector => `${selector}:disabled`)} {
      color: ${color};
      background-color: transparent;
    }


    ${selectors.map(selector => `${selector}:active`)} {
      color: ${color};
    }
  `
}

export const generateTextButtonCSS = (
  selectors: string[],
  color: string,
): string => {
  if (!colorsCache[color]) {
    colorsCache[color] = {}
  }

  if (!colorsCache[color]['rgba.10']) {
    colorsCache[color]['rgba.10'] = rgba(color, 10)
  }

  if (!colorsCache[color]['rgba.15']) {
    colorsCache[color]['rgba.15'] = rgba(color, 15)
  }

  const colorMap = colorsCache[color]

  return `
    ${selectors} {
      color: ${color};
      background: none;
    }

    ${selectors.map(selector => `${selector}:hover, ${selector}:focus`)} {
      color: ${color};
      text-decoration: none;
      background: ${colorMap['rgba.10']};
    }

    ${selectors.map(selector => `${selector}:active`)} {
      background: ${colorMap['rgba.15']};
    }

    ${selectors.map(selector => `${selector}:focus`)} {
      box-shadow: none;
    }
  `
}

export const generateCSS = (channel: Channel) => {
  const colorNames = Object.keys(channel.theme.color)
  let css = `
    .p-toolbar {
      padding-top: ${channel.theme.toolbarHeight}px;
    }
  `

  css += colorNames
    .map(colorName => {
      const cssColorVariables = Object.keys(channel.theme.color[colorName])
        .map(
          intensity =>
            `--color-${colorName}-${intensity}: ${channel.theme.color[colorName][intensity]};`,
        )
        .join('\n')

      return `
      :root {
        ${cssColorVariables}
      }

      ${generateCSSWithColorMap(
        channel.theme.color[colorName],
        `.bg-${colorName}`,
        'background-color',
      )}

      ${generateCSSWithColorMap(
        channel.theme.color[colorName],
        `.hover\\:bg-${colorName}`,
        'background-color',
        ':hover',
      )}

      ${generateCSSWithColorMap(
        channel.theme.color[colorName],
        `.tc-${colorName}`,
        'color',
      )}

      ${generateCSSWithColorMap(
        channel.theme.color[colorName],
        `.hover\\:tc-${colorName}`,
        'color',
        ':hover',
      )}
    `
    })
    .join('\n')

  css += `
  .input:focus {
    border-color: ${channel.theme.color.primary[500]}
  }

  .checkbox-indicator:focus {
    border-color: ${channel.theme.color.primary[500]};
    box-shadow: 0 0 8px ${channel.theme.color.primary[500]};
  }

  input:checked + .checkbox-indicator {
    background-color: ${channel.theme.color.primary[500]};
    border-color: ${channel.theme.color.primary[500]};
  }

  ${generateButtonCSS(['.btn-secondary'], channel.theme.color.secondary[500])}


  ${generateButtonCSS(
    ['.btn-primary', '.btn-apply'],
    channel.theme.primaryButtonBackground || channel.theme.color.primary[500],
  )}

  ${generateButtonOutlineCSS(
    ['.btn-outline-primary'],
    channel.theme.primaryButtonBackground || channel.theme.color.primary[500],
  )}

  ${generateButtonOutlineCSS(
    ['.btn-outline-secondary'],
    channel.theme.color.secondary[500],
  )}

  ${generateTextButtonCSS(
    ['.btn-text-primary'],
    channel.theme.color.primary[500],
  )}
  `

  return css
}

export default async () => {
  const baseCSS = generateCSS(loadChannelConfig())
  await mkdirpAsync(path.resolve('channel/generated/styles'))
  const result = await postcss(cssnano()).process(baseCSS, {
    from: undefined,
  })
  await writeFile(
    path.resolve('channel/generated/styles/channel.css'),
    result.css,
  )
}
