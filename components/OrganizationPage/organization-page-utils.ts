import { NextPageContext } from 'next'
import { NotFoundPageError } from '~/lib/next/errors'
import { fetchOrganization } from '~/redux/ducks/organization'
import { throwActionError } from '~/lib/utils/redux'
import { reportError } from '~/lib/utils/error'

export const getOrganizationPageInitialProps = async ({
  store,
  query: { organizationSlug: slug },
}: NextPageContext) => {
  if (typeof slug !== 'string') {
    throw new NotFoundPageError()
  }

  try {
    const { user: viewer } = store.getState()
    const organization = await store
      .dispatch(fetchOrganization(slug))
      .then(throwActionError)

    const isViewerMember = Boolean(
      viewer && viewer.organizations.some(o => o.slug === slug),
    )
    // Throw a 404 page if the organization not published and
    // an current user's organizations don't have access to it
    if (!organization.published && (!viewer || !isViewerMember)) {
      throw new NotFoundPageError()
    }

    return {
      organizationSlug: slug,
      isViewerMember,
    }
  } catch (error) {
    if (error.statusCode !== 404) {
      reportError(error)
    }

    throw error
  }
}
