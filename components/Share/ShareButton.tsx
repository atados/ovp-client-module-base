import React from 'react'
import { openWindow } from '~/lib/dom/window'
import * as ShareLinkCreators from './share-link-creators'

interface ShareButtonProps {
  readonly url: string
  readonly network: string
  readonly meta?:
    | ShareLinkCreators.FacebookShareMeta
    | ShareLinkCreators.LinkedinShareMeta
    | ShareLinkCreators.TwitterShareMeta
    | ShareLinkCreators.WhatsappShareMeta
}

const ShareButton: React.FC<ShareButtonProps> = ({
  children,
  network,
  url,
  meta,
}) =>
  React.cloneElement(React.Children.only(children) as React.ReactElement, {
    onClick: (event: React.MouseEvent) => {
      event.preventDefault()
      openWindow(ShareLinkCreators[network](url, meta))
    },
  })

ShareButton.displayName = 'ShareButton'

export default ShareButton
