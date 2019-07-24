import React from 'react'
import { FormComposerMode } from '~/components/FormComposer/FormComposer'
import ProjectComposerAbout from '~/components/ProjectComposer/steps/ProjectComposerAbout'
import ProjectComposerBasics from '~/components/ProjectComposer/steps/ProjectComposerBasics'
import ProjectComposerConclusion from '~/components/ProjectComposer/steps/ProjectComposerConclusion'
import ProjectComposerDisponibility from '~/components/ProjectComposer/steps/ProjectComposerDisponibility'
import ProjectComposerIntro from '~/components/ProjectComposer/steps/ProjectComposerIntro'
import ProjectComposerRoles from '~/components/ProjectComposer/steps/ProjectComposerRoles'
import { ProjectComposerDraft } from '~/pages/project-composer'
import { UserOrganization } from '~/redux/ducks/user'

interface ProjectComposerProps {
  readonly routerPathname: string
  readonly routerAs: string
  readonly organization?: UserOrganization
  readonly projectSlug?: string
  readonly mode?: FormComposerMode
  readonly draftIndex?: number
  readonly drafts: ProjectComposerDraft[]
}

const ProjectComposer: React.FC<ProjectComposerProps> = ({
  routerPathname,
  routerAs,
  organization,
  projectSlug,
  mode,
  draftIndex,
  drafts,
}) => (
  <>
    <ProjectComposerIntro
      routerPathname={routerPathname}
      routerAs={`${routerAs}/`}
      query={{
        projectSlug,
        organizationSlug: organization ? organization.slug : undefined,
        mode,
        draftIndex,
      }}
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
