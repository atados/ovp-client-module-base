import { rgba, shade } from '~/lib/color/transformers'

const colorsCache = {}

export const generateButtonCSS = (
  selectors: string[],
  background: string,
  color: string = '#fff',
): string => {
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
): string => {
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
  }
  `
}
