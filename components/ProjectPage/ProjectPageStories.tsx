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
        <Post key={`${post.id}${i}`} className="mb-4">
          <span className="tc-muted mb-2 d-block">
            {moment(post.created_date).format('LL')}
          </span>
          <h2 className="tw-normal mb-3">{post.title || 'Atualizações'}</h2>
          <Markdown value={post.content} className="ts-medium" />
          <hr className="mt-4 mb-4" />
        </Post>
      ))}
    </>
  )
}

ProjectPageStories.displayName = 'ProjectPageStory'

export default React.memo(ProjectPageStories)
