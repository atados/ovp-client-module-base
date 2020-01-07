import React from 'react'
import cx from 'classnames'

interface OrganizationAvailableProjectsProps {
  readonly className?: string
}

const OrganizationAvailableProjects: React.FC<OrganizationAvailableProjectsProps> = ({
  className,
}) => {
  return <div className={cx(className, '')} />
}

OrganizationAvailableProjects.displayName = 'OrganizationAvailableProjects'

export default OrganizationAvailableProjects
