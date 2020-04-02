import React from 'react'
import SearchForm from './SearchForm'
import useStartupData from '~/hooks/use-startup-data'

export default props => {
  const { data, loading } = useStartupData()

  if (!data || loading) {
    return null
  }

  const startupData = {
    causes: data.causes,
    skills: data.skills,
    stats: {
      volunteers: data.stats.volunteersCount,
      organizations: data.stats.organizationsCount,
    },
  }
  return <SearchForm {...props} startupData={startupData} />
}
