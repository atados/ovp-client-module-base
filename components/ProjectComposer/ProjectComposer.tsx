import React from 'react'
import ProjectComposerAbout from '~/components/ProjectComposer/steps/ProjectComposerAbout'
import ProjectComposerBasics from '~/components/ProjectComposer/steps/ProjectComposerBasics'
import ProjectComposerConclusion from '~/components/ProjectComposer/steps/ProjectComposerConclusion'
import ProjectComposerDisponibility from '~/components/ProjectComposer/steps/ProjectComposerDisponibility'
import ProjectComposerIntro from '~/components/ProjectComposer/steps/ProjectComposerIntro'
import ProjectComposerRoles from '~/components/ProjectComposer/steps/ProjectComposerRoles'
import { ProjectComposerDraft } from '~/pages/project-composer'
import { UserOrganization } from '~/redux/ducks/user'

interface ProjectComposerProps {
  readonly pageName: string
  readonly organization?: UserOrganization
  readonly drafts: ProjectComposerDraft[]
}

const ProjectComposer: React.FC<ProjectComposerProps> = ({
  pageName,
  organization,
  drafts,
}) => (
  <>
    <ProjectComposerIntro
      pageName={pageName}
      organizationSlug={organization && organization.slug}
      drafts={drafts}
    />
    <ProjectComposerBasics />
    <ProjectComposerDisponibility />
    <ProjectComposerRoles />
    <ProjectComposerAbout />
    <ProjectComposerConclusion />
  </>
)

ProjectComposer.displayName = 'ProjectComposer'

export default ProjectComposer
