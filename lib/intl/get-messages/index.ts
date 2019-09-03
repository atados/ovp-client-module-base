const getMessagesModule =
  typeof window === 'undefined'
    ? // tslint:disable-next-line:no-var-requires
      require('./get-messages.server')
    : // tslint:disable-next-line:no-var-requires
      require('./get-messages.client')

export default getMessagesModule.default
