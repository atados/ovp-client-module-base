import { NextPageContext } from 'next'
import { NotFoundPageError } from '~/base/lib/next/errors'
import { throwActionError } from '~/base/lib/utils/redux'
import { reportError } from '~/base/lib/utils/error'
import { fetchPublicUser } from '~/base/redux/ducks/public-user'

export const getPublicUserPageInitialProps = async ({
  store,
  query: { organizationSlug: slug },
}: NextPageContext) => {
  if (typeof slug !== 'string') {
    throw new NotFoundPageError()
  }

  try {
    const { user: viewer } = store.getState()
    const user = await store
      .dispatch(fetchPublicUser(slug))
      .then(throwActionError)

    if (!user) {
      throw new NotFoundPageError()
    }

    return {
      userSlug: slug,
      isViewer: Boolean(viewer && slug === viewer.slug),
    }
  } catch (error) {
    if (error.statusCode === 404) {
      throw new NotFoundPageError()
    }

    reportError(error)
    throw error
  }
}
