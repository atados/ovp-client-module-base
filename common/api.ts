export const QueryId = {
  ProjectApplies: (projectSlug: string) => `/projects/applies/${projectSlug}`,
}

export const APIEndpoint = {
  ProjectApplies: (projectSlug: string) => `/projects/${projectSlug}/applies/`,
  ProjectApply: (projectSlug: string, applyId: number) =>
    `/project/${projectSlug}/applies/${applyId}/`,
}
