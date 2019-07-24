export const ensureHttpsUri = (uri: string) => {
  const index = uri.indexOf('http://')

  if (!uri.trim().length) {
    return uri
  }

  if (index === -1) {
    const httpsIndex = uri.indexOf('https://')

    if (httpsIndex === -1) {
      return `https://${uri}`
    }

    return uri
  } else {
    return uri.replace(/^http:\/\//, 'https://')
  }
}

export function generateRandomId(): string {
  return Math.random()
    .toString(36)
    .substring(7)
}

const htmlEntities = {
  nbsp: ' ',
  cent: '¢',
  pound: '£',
  yen: '¥',
  euro: '€',
  copy: '©',
  reg: '®',
  lt: '<',
  gt: '>',
  quot: '"',
  amp: '&',
  apos: "'",
  ccedil: 'ç',
  aacute: 'á',
  ecirc: 'ê',
}
const RE_ENTITY = /\&([^;]+);/g
const RE_ENTITY_2 = /^#x([\da-fA-F]+)$/
const RE_ENTITY_3 = /^#(\d+)$/
function decodeEntity(entity: string, entityCode: string): string {
  if (htmlEntities[entityCode]) {
    return htmlEntities[entityCode]
  }

  let match = entityCode.match(RE_ENTITY_2)

  if (match) {
    return String.fromCharCode(parseInt(match[1], 16))
  }

  match = entityCode.match(RE_ENTITY_3)

  if (match) {
    // tslint:disable-next-line
    return String.fromCharCode(~~match[1])
  }

  return entity
}
export function unescapeHTML(str: string) {
  return str.replace(RE_ENTITY, decodeEntity)
}

export function formatToUSDate(value: string) {
  const [day, month, year] = value.split('/')
  return `${year}-${month}-${day}`
}

export function formatToBRDate(value: string) {
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}
