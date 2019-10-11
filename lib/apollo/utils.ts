export const isQueryReady = (query: {
  data?: any
  loading?: boolean
  error?: Error
}) => Boolean(query.data && !query.loading && !query.error)
