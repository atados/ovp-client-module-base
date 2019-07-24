import queryString from 'query-string'

export interface FacebookShareMeta {
  quote?: string
  hashtag?: string
}
export const facebook = (
  url: string,
  { quote, hashtag }: FacebookShareMeta = {},
) =>
  `https://www.facebook.com/sharer/sharer.php?${queryString.stringify({
    u: url,
    quote,
    hashtag,
  })}`

export interface LinkedinShareMeta {
  title: string
  description: string
}
export const linkedin = (
  url: string,
  { title, description }: LinkedinShareMeta,
) =>
  `https://linkedin.com/shareArticle?${queryString.stringify({
    url,
    title,
    summary: description,
  })}`

export interface TwitterShareMeta {
  title: string
  via?: string
  hashtags?: string[]
}
export const twitter = (
  url: string,
  { title, via, hashtags = [] }: TwitterShareMeta,
) =>
  `https://twitter.com/share?${queryString.stringify({
    url,
    via,
    text: title,
    hashtags: hashtags.join(','),
  })}`

export const messenger = (url: string) =>
  `fb-messenger://share?${queryString.stringify({
    link: url,
  })}`

export interface WhatsappShareMeta {
  title: string
  separator?: string
}
export const whatsapp = (
  url,
  { title, separator = ' - ' }: WhatsappShareMeta,
) =>
  `https://api.whatsapp.com/send?${queryString.stringify({
    text: `${title}${title ? separator : ''}${url}`,
  })}`
