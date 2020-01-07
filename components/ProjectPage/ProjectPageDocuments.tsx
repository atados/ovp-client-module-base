import React from 'react'
import styled from 'styled-components'
import { Project } from '~/redux/ducks/project'
import Icon from '../Icon'
import { defineMessages } from 'react-intl'
import { useIntl } from 'react-intl'

const Anchor = styled.a`
  word-break: break-all;
`

interface ProjectPageDocumentsProps {
  readonly project: Project
}

const { DOCUMENTOS } = defineMessages({
  DOCUMENTOS: {
    id: 'DOCUMENTOS',
    defaultMessage: 'Documentos anexados',
  },
})

const ProjectPageDocuments: React.FC<ProjectPageDocumentsProps> = ({
  project,
}) => {
  const intl = useIntl()

  if (!project.documents || !project.documents.length) {
    return null
  }

  return (
    <>
      <h4 className="mb-6">{intl.formatMessage(DOCUMENTOS)}</h4>
      <div className="card">
        {project.documents.map(document => (
          <Anchor
            href={document.document_url}
            className="p-4 card-item text-gray-800 media"
            key={document.id}
            target="__blank"
            download
          >
            <Icon name="insert_drive_file" className="text-xl" />
            <div className="media-body ml-2">{document.document_url}</div>
          </Anchor>
        ))}
      </div>
      <hr className="mt-6 mb-6" />
    </>
  )
}

ProjectPageDocuments.displayName = 'ProjectPageDocuments'

export default React.memo(ProjectPageDocuments)
