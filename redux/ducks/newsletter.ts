import { createAction } from 'redux-handy'
import { fetchAPI } from '~/lib/fetch'
import { pushToDataLayer } from '~/base/lib/tag-manager'

export interface NewsletterSubscriptionPayload {
  name: string
  email: string
  city: string
  employee_number?: number
}
export const subscribeToNewsletter = createAction<
  NewsletterSubscriptionPayload,
  boolean
>('NEWSLETTER_SUBSCRIBE', async body => {
  const resp = await fetchAPI('/lead/', {
    method: 'POST',
    body: {
      employee_number: 0,
      ...body,
    },
  })

  pushToDataLayer({
    event: 'newsletter.subscribe',
  })

  return resp
})
