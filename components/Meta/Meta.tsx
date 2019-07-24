import Header from 'next/head'
import React from 'react'
import { defineMessages } from 'react-intl'
import useIntl from '~/hooks/use-intl'
interface MetaProps {
  readonly title?: string
  readonly description?: string
  readonly image?: string
}

const messages = defineMessages({
  title: {
    id: 'meta.title',
    defaultMessage: 'Channel',
  },
  titleAddon: {
    id: 'meta.title_addon',
    defaultMessage: ' - Channel',
  },
  description: {
    id: 'meta.description',
    defaultMessage: 'Short channel description',
  },
})

const Meta: React.FC<MetaProps> = props => {
  const intl = useIntl()
  const {
    description = intl.formatMessage(messages.description),
    image,
  } = props
  const title = props.title
    ? `${props.title}${intl.formatMessage(messages.titleAddon)}`
    : intl.formatMessage(messages.title)
  return (
    <Header>
      {title && <title>{title}</title>}
      {title && <meta name="title" content={title} />}
      {title && <meta property="og:title" content={title} />}
      {description && <meta name="description" content={description} />}
      {description && <meta property="og:description" content={description} />}
      {image && <meta name="image" content={image} />}
      {image && <meta property="og:image" content={image} />}
    </Header>
  )
}

Meta.displayName = 'Meta'

export default Meta
