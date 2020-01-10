import { NextRouter } from 'next/router'

export default (
  router: NextRouter,
  cityName: string,
  skill?: string,
  cause?: string,
) => (event: React.ChangeEvent<HTMLSelectElement>) => {
  const queryObject = {
    skill: skill,
    cause: cause,
    [event.target.name]: event.target.value,
  }

  router.push({
    pathname: router.pathname.replace('[cityName]', cityName),
    query: queryObject,
  })
}
