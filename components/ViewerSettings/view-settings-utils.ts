import { NextPageContext } from 'next'
import { redirect } from '~/lib/utils/next'
import { Page } from '~/common'
export const getViewerSettingsInitialProps = async (ctx: NextPageContext) => {
  const { user: viewer } = ctx.store.getState()

  if (!viewer) {
    redirect(ctx, `${Page.Login}?next=${ctx.pathname}`)
  }

  return {}
}
