import { Express, Request } from 'express'
import * as path from 'path'
import { colors, dev } from '~/common/constants'
import { fetchAPI } from '~/lib/fetch'
import { Cause, Skill } from '~/redux/ducks/channel'
import { StartupData } from '~/redux/ducks/startup'

export interface ChannelRequest extends Request {
  startupData: StartupData
}

let lastTimeFetched: number = 0
let cachedStartupData: StartupData | undefined

async function getStartupData(): Promise<StartupData> {
  // Update channel every request in development environment
  // On production, update every 6 hours
  if (!dev && cachedStartupData && Date.now() - lastTimeFetched < 21600) {
    return cachedStartupData
  }

  lastTimeFetched = Date.now()
  const channelConfigPath = path.resolve('channel/channel.json')
  // @ts-ignore
  delete __non_webpack_require__.cache[channelConfigPath]

  try {
    const {
      causes,
      skills,
      volunteer_count: volunteerCount,
      nonprofit_count: nonprofitCount,
    } = await fetchAPI<{
      volunteer_count: number
      nonprofit_count: number
      causes: Cause[]
      skills: Skill[]
    }>('/startup/')
    cachedStartupData = {
      skills,
      causes: causes
        .map((cause, i) => ({
          ...cause,
          color: colors[i % (colors.length - 1)],
        }))
        .sort((x, y) => x.id - y.id),
      stats: {
        volunteers: volunteerCount || 0,
        organizations: nonprofitCount || 0,
      },
    }
  } catch (error) {
    if (dev) {
      console.error('> Failed to fetch startup')
    } else {
      console.error(error)
    }
  }

  if (!cachedStartupData) {
    cachedStartupData = {
      skills: [],
      causes: [],
      stats: {
        volunteers: 0,
        organizations: 0,
      },
    }

    return cachedStartupData
  }

  return cachedStartupData
}

const RE_STARTUP_DATA_NOT_NEEDED_URL = /^\/(_next)/
export default (server: Express) => {
  server.use(async (req: ChannelRequest, _, next) => {
    // Prevent user fetching at dev-only routes
    if (RE_STARTUP_DATA_NOT_NEEDED_URL.test(req.url)) {
      next()
      return
    }

    req.startupData = await getStartupData()
    next()
  })
}
