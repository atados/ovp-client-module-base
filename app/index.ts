import { AppConfiguration, ValidBasePageName } from './config'
import { DEFAULT_SENTRY_DSN } from '~/lib/utils/error'
export type ValidPageName = ValidBasePageName

const app: AppConfiguration<ValidBasePageName> = {
  id: 'default',
  theme: {
    color: {
      primary: {
        '100': '#e6f1fa',
        '200': '#bfddf2',
        '300': '#99c8ea',
        '400': '#4d9fda',
        '500': '#0076ca',
        '600': '#006ab6',
        '700': '#004779',
        '800': '#00355b',
        '900': '#00233d',
      },
      secondary: {
        '100': '#fcefe6',
        '200': '#f8d8c2',
        '300': '#f4c09d',
        '400': '#eb9153',
        '500': '#e36209',
        '600': '#cc5808',
        '700': '#883b05',
        '800': '#662c04',
        '900': '#441d03',
      },

      gray: {
        '100': '#f7fafc',
        '200': '#edf2f7',
        '300': '#e2e8f0',
        '400': '#cbd5e0',
        '500': '#a0aec0',
        '600': '#718096',
        '700': '#4a5568',
        '800': '#2d3748',
        '900': '#1a202c',
      },
      green: {
        '100': '#f0fff4',
        '200': '#c6f6d5',
        '300': '#9ae6b4',
        '400': '#68d391',
        '500': '#48bb78',
        '600': '#38a169',
        '700': '#2f855a',
        '800': '#276749',
        '900': '#22543d',
      },
      blue: {
        '100': '#ebf8ff',
        '200': '#bee3f8',
        '300': '#90cdf4',
        '400': '#63b3ed',
        '500': '#4299e1',
        '600': '#3182ce',
        '700': '#2b6cb0',
        '800': '#2c5282',
        '900': '#2a4365',
      },
      red: {
        '100': '#fff5f5',
        '200': '#fed7d7',
        '300': '#feb2b2',
        '400': '#fc8181',
        '500': '#f56565',
        '600': '#e53e3e',
        '700': '#c53030',
        '800': '#9b2c2c',
        '900': '#742a2a',
      },
    },
  },
  geolocation: {
    default: {
      countryCode: 'BR',
      regionCode: 'SP',
      latitude: -23.5283838,
      longitude: -46.6021955,
    },
  },
  pages: {
    Home: { pathname: '/', filename: 'home' },
    City: { pathname: '/cidade/[cityName]', filename: 'city' },
    ProjectDashboard: {
      pathname: '/gerenciar/[projectSlug]',
      filename: 'manage-project',
    },
    Organization: {
      pathname: '/ong/[organizationSlug]',
      filename: 'organization',
    },
    Project: { pathname: '/vaga/[slug]', filename: 'project' },
    Cause: { pathname: '/causa/[slug]', filename: 'cause' },
    Login: { pathname: '/entrar', filename: 'authentication' },
    NewAccount: {
      pathname: '/nova-conta',
      filename: 'authentication',
      query: {
        defaultPage: 'new-account',
      },
    },
    Search: { pathname: '/explorar', filename: 'explore' },
    SearchProjects: {
      pathname: '/vagas',
      filename: 'explore',
      query: { searchType: '1' },
    },
    SearchOrganizations: {
      pathname: '/ongs',
      filename: 'explore',
      query: { searchType: '2' },
    },
    Inbox: { pathname: '/mensagens', filename: 'inbox' },
    ViewerProjectDashboard: {
      pathname: '/gerenciar/vaga/[projectSlug]',
      filename: 'manage-project',
    },
    ViewerProjects: {
      pathname: '/gerenciar/vagas',
      filename: 'manageable-projects-list',
    },
    OrganizationDashboardProject: {
      pathname: '/ong/[organizationSlug]/gerenciar/vaga/[projectSlug]',
      filename: 'manage-project',
    },
    OrganizationDashboardProjectsList: {
      pathname: '/ong/[organizationSlug]/gerenciar/vagas',
      filename: 'manageable-projects-list',
    },
    OrganizationDashboardMembers: {
      pathname: '/ong/[organizationSlug]/gerenciar/membros',
      filename: 'organization-members',
    },
    OrganizationProjects: {
      pathname: '/ong/[organizationSlug]/vagas',
      filename: 'organization-projects',
    },
    OrganizationAbout: {
      pathname: '/ong/[organizationSlug]/sobre',
      filename: 'organization-about',
    },
    OrganizationEdit: {
      pathname: '/ong/[organizationSlug]/editar/[stepId]',
      filename: 'organization-edit',
    },
    OrganizationJoin: {
      pathname: '/ong/[organizationSlug]/participar',
      filename: 'organization-join',
    },
    OrganizationNewProject: {
      pathname: '/ong/[organizationSlug]/gerenciar/vagas/nova/[stepId]',
      filename: 'project-composer',
    },
    OrganizationDuplicateProject: {
      pathname:
        '/ong/[organizationSlug]/gerenciar/vaga/[projectSlug]/duplicar/[stepId]',
      filename: 'project-composer',
    },
    OrganizationEditProject: {
      pathname:
        '/ong/[organizationSlug]/gerenciar/vaga/[projectSlug]/editar/[stepId]',
      filename: 'project-composer',
      query: {
        mode: 'EDIT',
      },
    },
    OrganizationOnboarding: {
      pathname: '/sou-uma-ong',
      filename: 'organization-onboarding',
    },
    NewOrganization: {
      pathname: '/sou-uma-ong/[stepId]',
      filename: 'organization-composer',
    },
    NewProject: {
      pathname: '/criar-vaga/[stepId]',
      filename: 'project-composer',
    },
    DuplicateProject: {
      pathname: '/gerenciar/vaga/[projectSlug]/duplicar/[stepId]',
      filename: 'project-composer',
    },
    EditProject: {
      pathname: '/gerenciar/vaga/[projectSlug]/editar/[stepId]',
      filename: 'project-composer',
      query: {
        mode: 'EDIT',
      },
    },
    PublicUser: {
      pathname: '/voluntario/[slug]',
      filename: 'public-user',
    },
    RecoverPassword: {
      pathname: '/recuperar-senha',
      filename: 'recover-password',
    },
    ForgotPassword: {
      pathname: '/esqueci-minha-senha',
      filename: 'new-password-recovery-request',
    },
    ViewerOrganizations: {
      pathname: '/eu/ongs',
      filename: 'settings-organizations',
    },
    ViewerSettingsNewsletter: {
      pathname: '/eu/newsletter',
      filename: 'settings-newsletter',
    },
    ViewerSettingsPassword: {
      pathname: '/eu/alterar-senha',
      filename: 'settings-password',
    },
    ViewerSettings: {
      pathname: '/eu/configuracoes',
      filename: 'settings-user',
    },
    ViewerDeleteAccount: {
      pathname: '/eu/encerrar',
      filename: 'settings-delete-account',
    },
    PrivacyTerms: {
      pathname: '/termos/privacidade',
      filename: 'privacy-terms',
    },
    VolunteerTerms: {
      pathname: '/termos/voluntariado',
      filename: 'volunteer-terms',
    },
    UsageTerms: { pathname: '/termos/uso', filename: 'volunteer-terms' },
    ApprovalTerms: {
      pathname: '/termos/aprovacao',
      filename: 'approval-terms',
    },
    TermsList: { pathname: '/termos', filename: 'terms-list' },
    FAQ: { pathname: '/faq', filename: 'faq' },
    Viewer: { pathname: '/eu', filename: 'viewer' },
    FAQQuestion: { pathname: '/faq/[id]', filename: 'faq-question' },
    OrganizationProjectNewPost: {
      pathname:
        '/ong/[organizationSlug]/gerenciar/vaga/[projectSlug]/publicacoes/nova',
      filename: 'post-form',
    },
    OrganizationProjectEditPost: {
      pathname:
        '/ong/[organizationSlug]/gerenciar/vaga/[projectSlug]/publicacoes/editar/[postId]',
      filename: 'post-form',
    },
    ProjectNewPost: {
      pathname: '/gerenciar/vaga/[projectSlug]/publicacoes/nova',
      filename: 'post-form',
    },
    ProjectEditPost: {
      pathname: '/gerenciar/vaga/[projectSlug]/publicacoes/editar/[postId]',
      filename: 'post-form',
    },
    ConfirmEmail: {
      pathname: '/email/confirmar',
      filename: 'email-confirmation',
    },
    _Facebook: {
      pathname: '/api/facebook/[action]',
      filename: 'api/auth/facebook',
    },
    _Google: {
      pathname: '/api/google/[action]',
      filename: 'api/auth/google',
    },
  },
  assets: {},
  chat: {
    enabled: false,
    beta: true,
  },
  footer: {
    links: [],
  },
  head: {
    links: [],
    scripts: [],
  },
  organization: {
    enabled: true,
  },
  popover: {},
  project: {
    galleries: true,
    posts: true,
    documents: true,
    documentsRestricted: false,
  },
  social: [],
  toolbar: {
    links: [],
    height: 56,
  },
  useDeviceLanguage: true,
  user: {
    createProject: false,
  },
  emailConfirmation: {
    warning: true,
  },
  sentry: {
    dsn: DEFAULT_SENTRY_DSN,
  },
  maps: {
    key: 'AIzaSyCu4PCImzrGE9M_lTKI9t00O7J-dwPVXiY',
  },
}

export default app
