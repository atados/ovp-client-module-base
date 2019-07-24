export function createAccentFriendlyRegexp(pattern: string, flags: string) {
  return new RegExp(
    pattern.replace(
      /(a|á|à|ã)|(c|ç)|(e|é|è|ê)|(o|ó|ô)|(u|ú|û)|(\s+)/g,
      (x, a, c, e, o, u, s) => {
        if (a) {
          return '(?:a|á|à|ã)'
        }
        if (o) {
          return '(?:o|ó|ô)'
        }

        if (c) {
          return '(?:c|ç)'
        }

        if (e) {
          return '(?:e|é|è|ê)'
        }

        if (u) {
          return '(u|ú|û)'
        }

        if (s) {
          return '(?:\\s+|\\s*,\\s*)'
        }

        return x
      },
    ),
    flags,
  )
}
