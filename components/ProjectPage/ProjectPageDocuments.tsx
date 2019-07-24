import React from 'react'
import styled from 'styled-components'
import { Project } from '~/redux/ducks/project'
import Icon from '../Icon'

const Anchor = styled.a`
  word-break: break-all;
`

interface ProjectPageDocumentsProps {
  readonly project: Project
}

const ProjectPageDocuments: React.FC<ProjectPageDocumentsProps> = ({
  project,
}) => {
  if (!project.documents || !project.documents.length) {
    return null
  }

  return (
    <>
      <h4 className="mb-4">Documentos anexados</h4>
      <div className="card">
        {project.documents.map(document => (
          <Anchor
            href={document.document_url}
            className="p-4 card-item tc-base media"
            key={document.id}
            target="__blank"
            download
          >
            <Icon name="insert_drive_file" className="ts-large" />
            <div className="media-body ml-2">{document.document_url}</div>
          </Anchor>
        ))}
      </div>
      <hr className="mt-4 mb-4" />
    </>
  )
}

ProjectPageDocuments.displayName = 'ProjectPageDocuments'

export default React.memo(ProjectPageDocuments)
