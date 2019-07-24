import { IdGetter } from 'apollo-cache-inmemory'

const getDataIdFromObject: IdGetter = result => {
  if (result.__typename) {
    if (result.__typename === 'Message') {
      return null
    }

    if (result.__typename === 'Thread') {
      // @ts-ignore
      return `Thread:${result.id}:${result.threadableId}`
    }

    if (result.id !== undefined) {
      return result.__typename + ':' + result.id
    }
  }
  return null
}

export default getDataIdFromObject
