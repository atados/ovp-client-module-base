import PublicUserPage, { PublicUserPageProps } from '~/base/pages/public-user'
import { NextPage } from 'next'
import { NotFoundPageError } from '../lib/next/errors'

const ViewerPage: NextPage<PublicUserPageProps> = props => (
  <PublicUserPage {...props} />
)
ViewerPage.getInitialProps = async ctx => {
  const { user } = ctx.store.getState()

  if (!user) {
    throw new NotFoundPageError()
  }

  ctx.query.slug = user.slug
  return PublicUserPage.getInitialProps!(ctx)
}

export default ViewerPage
