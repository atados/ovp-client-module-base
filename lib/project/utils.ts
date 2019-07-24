import moment from 'moment'
import { defineMessages } from 'react-intl'
import { Disponibility, JobDate, JobDisponibility } from '~/redux/ducks/project'

const { work } = defineMessages({
  work: {
    id: 'disponibility.work',
    defaultMessage: 'Recorrente',
  },
})

export function findNearestDate(
  disponibility: JobDisponibility,
  relativeTo: Date = new Date(),
): JobDate {
  // Find the next date relative to given date
  let nextDate = disponibility.job.dates.find(
    date => new Date(date.start_date) >= relativeTo,
  )

  // If there isn't a next date, pick the last one
  if (!nextDate) {
    nextDate = disponibility.job.dates[disponibility.job.dates.length - 1]
  }

  if (!nextDate && disponibility.job.start_date && disponibility.job.end_date) {
    nextDate = {
      name: '',
      start_date: disponibility.job.start_date,
      end_date: disponibility.job.end_date,
    }
  }

  return nextDate
}

export function formatDisponibility(
  disponibility: Disponibility,
  intl: any,
  relative: boolean = false,
): string {
  if (!disponibility) {
    return 'N/A'
  }

  if (disponibility.type === 'work') {
    return intl.formatMessage(work)
  }

  let nextDate
  if (!disponibility.job || !disponibility.job.dates) {
    nextDate = disponibility.job.start_date
  } else {
    nextDate = findNearestDate(disponibility, new Date())
  }

  return nextDate
    ? relative
      ? moment(nextDate.start_date).fromNow()
      : moment(nextDate.start_date).format('L')
    : 'N/A'
}
