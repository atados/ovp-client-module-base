export const Endpoint = {
  Catalogue: ({ slug, filterByAddress }) =>
    `/catalogue/${slug}/${
      filterByAddress ? `address=${JSON.stringify(filterByAddress)}` : ''
    }`,
}
