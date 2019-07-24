export const hasQuerySucceeded = (query: any): boolean =>
  Boolean(!query.loading && !query.error && query.data)
