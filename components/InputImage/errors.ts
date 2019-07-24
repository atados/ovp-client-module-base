export class UploadError extends Error {
  public type: string | number

  constructor(type: string | number, message: string) {
    super(message)

    this.type = type
    this.message = message
  }
}
