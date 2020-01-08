import { colors, dev } from '~/common/constants'
import { fetchAPI } from '~/lib/fetch'
import { API } from '~/base/types/api'

export async function getStartupData(
  locale?: string,
): Promise<API.StartupPayload> {
  try {
    const {
      causes,
      skills,
      volunteer_count: volunteerCount,
      nonprofit_count: nonprofitCount,
    } = await fetchAPI<{
      volunteer_count: number
      nonprofit_count: number
      causes: API.Cause[]
      skills: API.Skill[]
    }>('/startup/', {
      headers: {
        'Accept-Language': locale,
      },
    })
    return {
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

  return {
    skills: [],
    causes: [],
    stats: {
      volunteers: 0,
      organizations: 0,
    },
  }
}
