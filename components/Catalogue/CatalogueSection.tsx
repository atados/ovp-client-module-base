import React from 'react'
import OrganizationCard from '~/components/OrganizationCard'
import ProjectCard from '~/components/ProjectCard'
import { CatalogueSectionType } from '~/redux/ducks/catalogue'

interface CatalogueSectionProps {
  readonly className?: string
  readonly name?: React.ReactNode
  readonly section: CatalogueSectionType
}

const CatalogueSection: React.FC<CatalogueSectionProps> = ({
  className,
  section,
  name,
}) => {
  const nodes =
    section.type === 'organizations' ? section.organizations : section.projects

  if (nodes.length === 0) {
    return null
  }

  return (
    <div className={className}>
      <h4 className="mb-3">{name || section.name}</h4>
      <div className="row">
        {section.type === 'organizations'
          ? section.organizations.map(organization => (
              <div
                key={organization.slug}
                className="col-6 col-md-3 mb-4 col-lg-2 mb-4"
              >
                <OrganizationCard organization={organization} />
              </div>
            ))
          : section.projects.map(project => (
              <div key={project.slug} className="col-6 col-lg-3 mb-4">
                <ProjectCard {...project} />
              </div>
            ))}
      </div>
    </div>
  )
}
CatalogueSection.displayName = 'CatalogueSection'

export default CatalogueSection
