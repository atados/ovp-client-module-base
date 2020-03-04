import { defineMessages } from 'react-intl'
import { styles } from './ProjectCard'
import React from 'react'

const m = defineMessages({
  by: {
    id: 'projectCard.by',
    defaultMessage: 'por',
  },
})

const ProjectCardBody = props => {
  const { Author, Name, Description } = styles
  const {
    name,
    description,
    intl,
    organization,
    closed,
    nameClassName,
    descriptionClassName,
    link,
    linkOrganization,
  } = props

  return (
    <>
      <Author className="truncate">
        {closed && (
          <>
            <span className="text-red-600 font-medium">ENCERRADA</span> -{' '}
          </>
        )}
        {organization && (
          <>
            {!closed && intl.formatMessage(m.by)}{' '}
            {organization && linkOrganization(organization.name)}
          </>
        )}
      </Author>
      {link(<Name className={`truncate ${nameClassName || ''}`}>{name}</Name>)}
      <Description className={descriptionClassName}>{description}</Description>
    </>
  )
}

export default ProjectCardBody
