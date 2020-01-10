import { Channel } from '~/base/common'

export default JSON.parse(process.env.CHANNEL_JSON as string) as Channel
