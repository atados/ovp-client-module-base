import { useSWRPages } from 'swr'
import React from 'react'

import ActivityIndicator from '~/components/ActivityIndicator'
import { SearchProjectsParams } from '~/common/api-endpoints'
import { useSWRWithExtras } from '~/hooks/use-swr'
import ProjectCard from '~/components/ProjectCard'
import { APIEndpoint } from '~/common'

interface IProjectsScrollPagination {
  filters?: SearchProjectsParams
}

function ProjectsScrollPagination({ filters }: IProjectsScrollPagination) {
  const apiUrl = APIEndpoint.SearchProjects(filters)
  const { pages, isLoadingMore, loadMore, isReachingEnd } = useSWRPages(
    apiUrl,

    ({ offset, withSWR }) => {
      const url = offset || apiUrl
      const { data } = withSWR(useSWRWithExtras(url))

      if (!data?.results) {
        return null
      }

      const { results } = data
      if (results.length) {
        return results.map(p => (
          <div key={p.slug} className="w-full lg:w-1/4 mb-6 px-2">
            <ProjectCard {...p} />
          </div>
        ))
      }
      return (
        <p className="text-primary-500 text-4xl text-center">
          Não encontramos nenhuma vaga
        </p>
      )
    },
    SWR => SWR.data?.next?.replace('http://', 'https://') || null,
    [],
  )

  return (
    <>
      <div className="flex flex-wrap -mx-2 mt-5">{pages}</div>
      <div className="mx-auto mt-10 mb-20 w-1/3">
        {isLoadingMore && <ActivityIndicator className="w-full" />}
        {!isReachingEnd && !isLoadingMore && (
          <button
            className="btn bg-white text-primary-500 btn--size-3 btn--block"
            disabled={isLoadingMore}
            onClick={loadMore}
          >
            Ver mais vagas
          </button>
        )}
      </div>
    </>
  )
}

export default ProjectsScrollPagination
