export class NotFoundPageError extends Error {
  public code: string
  public statusCode: number

  constructor(message?: string) {
    super(message)

    this.code = 'ENOENT'
    this.statusCode = 404
  }
}
