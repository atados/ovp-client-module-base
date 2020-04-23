import { NextApiRequest, NextApiResponse } from 'next'
import { CHANNEL_ID } from '~/common'
import { AppIntl } from '~/lib/intl'
import { API_URL } from '~/common/constants'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { id },
  } = req

  const results = await fetch(`${API_URL}/search/all/?cause=${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': AppIntl.locale,
      'x-ovp-channel': CHANNEL_ID,
      Accept: 'application/json',
    },
  }).then(response => response.json())

  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate')
  res.json(results)
}
