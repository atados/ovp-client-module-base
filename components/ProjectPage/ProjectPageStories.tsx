import moment from 'moment'
import React from 'react'
import styled from 'styled-components'
import { Project } from '~/redux/ducks/project'
import Markdown from '../Markdown'

const Post = styled.div`
  max-width: 700px;
`

interface ProjectPageStoryProps {
  readonly project: Project
}

const ProjectPageStories: React.FC<ProjectPageStoryProps> = ({ project }) => {
  if (!project.posts.length) {
    return null
  }

  return (
    <>
      {project.posts.map((post, i) => (
        <Post key={`${post.id}${i}`} className="mb-6">
          <span className="text-gray-600 mb-2 block">
            {moment(post.created_date).format('LL')}
          </span>
          <h2 className="font-normal mb-4">{post.title || 'Atualizações'}</h2>
          <Markdown value={post.content} className="text-lg" />
          <hr className="mt-6 mb-6" />
        </Post>
      ))}
    </>
  )
}

ProjectPageStories.displayName = 'ProjectPageStory'

export default React.memo(ProjectPageStories)
