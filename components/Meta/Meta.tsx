import Header from 'next/head'
import React from 'react'
import { defineMessages } from 'react-intl'
import { useIntl } from 'react-intl'
import { GlobalMessages } from '~/common'
interface MetaProps {
  readonly title?: string
  readonly description?: string
  readonly image?: string
}

const messages = defineMessages({
  title: {
    id: 'meta.title',
    defaultMessage: '{appName}',
  },
  titleAddon: {
    id: 'meta.title_addon',
    defaultMessage: ' - {appName}',
  },
  description: {
    id: 'meta.description',
    defaultMessage: 'Encontre vagas de voluntariado',
  },
})

const Meta: React.FC<MetaProps> = props => {
  const intl = useIntl()
  const appName = intl.formatMessage(GlobalMessages.appName)
  const {
    description = intl.formatMessage(messages.description, { appName }),
    image,
  } = props

  const title = props.title
    ? `${props.title}${intl.formatMessage(messages.titleAddon, {
        appName,
      })}`
    : intl.formatMessage(messages.title, { appName })

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
