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
      <h4 className="mb-4">{name || section.name}</h4>
      <div className="flex -mx-2 flex-wrap">
        {section.type === 'organizations'
          ? section.organizations.map(organization => (
              <div
                key={organization.slug}
                className="px-2 w-1/2 md:1/4 mb-6 lg:1/6"
              >
                <OrganizationCard organization={organization} />
              </div>
            ))
          : section.projects.map(project => (
              <div key={project.slug} className="px-2 w-1/2 lg:w-1/4 mb-6">
                <ProjectCard {...project} />
              </div>
            ))}
      </div>
    </div>
  )
}
CatalogueSection.displayName = 'CatalogueSection'

export default CatalogueSection
