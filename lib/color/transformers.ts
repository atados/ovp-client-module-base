export type HSL = [number, number, number]
export type RGB = [number, number, number]

export function rgbToHsl(
  intRed: number,
  intGreen: number,
  intBlue: number,
): HSL {
  const r = intRed / 255
  const g = intGreen / 255
  const b = intBlue / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  let h = (max + min) / 2
  let s = h
  const l = h

  if (max === min) {
    // Achromatic
    h = 0
    s = 0
  } else {
    const diff = max - min
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min)

    if (max === r) {
      h = (g - b) / diff + (g < b ? 6 : 0)
    } else if (max === g) {
      h = (b - r) / diff + 2
    } else if (max === b) {
      h = (r - g) / diff + 4
    }

    h /= 6
  }

  return [h * 360, s * 100, l * 100]
}

export function hueToRGB(p: number, q: number, t: number): number {
  if (t < 0) {
    t += 1
  }

  if (t > 1) {
    t -= 1
  }

  if (t < 1 / 6) {
    return p + (q - p) * 6 * t
  }

  if (t < 1 / 2) {
    return q
  }

  if (t < 2 / 3) {
    return p + (q - p) * (2 / 3 - t) * 6
  }

  return p
}

export function hslToRgb(
  hue: number,
  saturation: number,
  lightness: number,
): RGB {
  const h = hue / 360
  const s = saturation / 100
  const l = lightness / 100
  let r
  let g
  let b

  if (s === 0) {
    r = l
    g = l
    b = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hueToRGB(p, q, h + 1 / 3)
    g = hueToRGB(p, q, h)
    b = hueToRGB(p, q, h - 1 / 3)
  }

  return [r * 255, g * 255, b * 255]
}

function intToHex(int: number): string {
  const hex = int.toString(16)
  return hex.length === 1 ? `0${hex}` : hex
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${intToHex(r)}${intToHex(g)}${intToHex(b)}`
}

export function hslToHex(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l)
  return rgbToHex(Math.round(rgb[0]), Math.round(rgb[1]), Math.round(rgb[2]))
}

export function hexToRgb(hex: string): RGB {
  const startIndex = hex.indexOf('#') + 1
  const length = hex.length > 4 ? 2 : 1

  const rgb = [
    hex.substr(startIndex, length),
    hex.substr(startIndex + length, length),
    hex.substr(startIndex + length * 2, length),
  ]

  if (length === 1) {
    rgb[0] = `${rgb[0]}${rgb[0]}`
    rgb[1] = `${rgb[1]}${rgb[1]}`
    rgb[2] = `${rgb[2]}${rgb[2]}`
  }

  return [parseInt(rgb[0], 16), parseInt(rgb[1], 16), parseInt(rgb[2], 16)]
}

export function hexToHsl(hex: string): HSL {
  const rgb = hexToRgb(hex)

  return rgbToHsl(rgb[0], rgb[1], rgb[2])
}

interface RGBSymbol {
  type: 'rgb'
  value: RGB
}

interface HEXSymbol {
  type: 'hex'
  value: string
}

interface HSLSymbol {
  type: 'hsl'
  value: HSL
}

interface ParsedSymbol {
  type: string
  value: number[]
}

export function parseSymbol(
  symbol: string,
): RGBSymbol | HEXSymbol | HSLSymbol | ParsedSymbol {
  if (symbol.trim().startsWith('#')) {
    return {
      type: 'hex',
      value: symbol,
    }
  }

  const arr: string[] = []
  let type: string = ''
  let inScope = false
  let i = 0
  let n = 0
  for (; i < symbol.length; i += 1) {
    const code = symbol.charCodeAt(i)
    if (code === 40) {
      inScope = true
    } else if (code === 41) {
      break
    } else if (code !== 32 && code !== 10 && code !== 9) {
      if (inScope) {
        if (code === 44) {
          arr.push('')
          n += 1
        } else if (n === arr.length) {
          arr.push(symbol[i])
        } else {
          arr[n] += symbol[i]
        }
      } else {
        type += symbol[i]
      }
    }
  }

  return {
    type,
    value: arr.map(parseFloat),
  }
}

export const shade = (symbol: string, p = 0) => {
  const node = parseSymbol(symbol)
  let hsl
  if (node.type === 'hex') {
    hsl = hexToHsl(node.value as string)
  } else if (node.type === 'rgb' || node.type === 'rgba') {
    hsl = rgbToHsl(
      node.value[0] as number,
      node.value[1] as number,
      node.value[2] as number,
    )
  } else if (node.type === 'hsl') {
    hsl = node.value
  }

  return hslToHex(hsl[0], hsl[1], Math.max(0, Math.min(100, hsl[2] + p)))
}

/*
  @arg alpha number
*/
export const rgba = (symbol: string, alpha: number): string => {
  const node = parseSymbol(symbol)

  let rgb: RGB | undefined
  if (node.type === 'hex') {
    rgb = hexToRgb(node.value as string)
  } else if (node.type === 'rgb') {
    rgb = node.value as RGB
  } else if (node.type === 'hsl') {
    rgb = hslToRgb(
      node.value[0] as number,
      node.value[1] as number,
      node.value[2] as number,
    )
  }

  if (!rgb) {
    throw new Error('Invalid color symbol')
  }

  return `rgba(${rgb.join(',')}, ${alpha / 100})`
}
