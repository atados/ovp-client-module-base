const Yup = require('yup')

const LinkSchema = Yup.object().shape({
  href: Yup.string().required(),
  as: Yup.string(),
})

const ColorSchema = Yup.object().shape({
  100: Yup.string().required(),
  200: Yup.string().required(),
  300: Yup.string().required(),
  400: Yup.string().required(),
  500: Yup.string().required(),
  600: Yup.string().required(),
  700: Yup.string().required(),
  800: Yup.string().required(),
  900: Yup.string().required(),
})

const PageSchema = Yup.string()
const ChannelConfigSchema = Yup.object().shape({
  id: Yup.string().required(),
  theme: Yup.object()
    .shape({
      color: Yup.object()
        .shape({
          primary: ColorSchema.required(),
          secondary: ColorSchema.required(),
          gray: ColorSchema.default({
            100: '#f7fafc',
            200: '#edf2f7',
            300: '#e2e8f0',
            400: '#cbd5e0',
            500: '#a0aec0',
            600: '#718096',
            700: '#4a5568',
            800: '#2d3748',
            900: '#1a202c',
          }),
        })
        .required(),
      darkIcons: Yup.boolean(),
      footerBackground: Yup.string(),
      footerTheme: Yup.string().oneOf(['light', 'dark']),
      iconRating: Yup.string(),
      toolbarHeight: Yup.number().default(56),
    })
    .required(),
  head: Yup.object()
    .shape({
      links: Yup.array(Yup.object().shape({ href: Yup.string() })).default([]),
      scripts: Yup.array(Yup.object().shape({ href: Yup.string() })).default(
        [],
      ),
    })
    .default({}),
  assets: Yup.object()
    .shape({
      Logo: Yup.string().default('/static/logo.svg'),
      Favicon: Yup.string(),
      ToolbarBrand: Yup.string(),
      FooterBrand: Yup.string(),
    })
    .default({}),
  pages: Yup.object()
    .shape({
      Home: PageSchema.default('/'),
      Organization: PageSchema.default('/ong/[organizationSlug]'),
      Project: PageSchema.default('/vaga/[slug]'),
      Cause: PageSchema.default('/causa/[slug]'),
      Login: PageSchema.default('/entrar'),
      NewAccount: PageSchema.default('/entrar'),
      Search: PageSchema.default('/explorar'),
      SearchProjects: PageSchema.default('/vagas'),
      SearchOrganizations: PageSchema.default('/ongs'),
      Inbox: PageSchema.default('/mensagens'),
      ViewerProjectDashboard: PageSchema.default(
        '/gerenciar/vaga/[projectSlug]',
      ),
      ViewerProjects: PageSchema.default('/gerenciar/vagas'),
      OrganizationDashboardProject: PageSchema.default(
        '/ong/[organizationSlug]/gerenciar/vaga/[projectSlug]',
      ),
      OrganizationDashboardProjectsList: PageSchema.default(
        '/ong/[organizationSlug]/gerenciar/vagas',
      ),
      OrganizationDashboardMembers: PageSchema.default(
        '/ong/[organizationSlug]/gerenciar/membros',
      ),
      OrganizationProjects: PageSchema.default('/ong/[organizationSlug]/vagas'),
      OrganizationEdit: PageSchema.default('/ong/[organizationSlug]/editar'),
      OrganizationJoin: PageSchema.default(
        '/ong/[organizationSlug]/participar',
      ),
      OrganizationNewProject: PageSchema.default(
        '/ong/[organizationSlug]/gerenciar/vagas/nova/[stepId]',
      ),
      NewOrganization: PageSchema.default('/sou-uma-ong/[stepId]'),
      NewProject: PageSchema.default('/criar-vaga/[stepId]'),
      PublicUser: PageSchema.default('/voluntario/[slug]'),
      RecoverPassword: PageSchema.default('/recuperar-senha'),
      ForgotPassword: PageSchema.default('/esqueci-minha-senha'),
      ViewerOrganizations: PageSchema.default('/eu/ongs'),
      ViewerSettingsPassword: PageSchema.default('/eu/alterar-senha'),
      ViewerSettings: PageSchema.default('/eu/configuracoes'),
      PrivacyTerms: PageSchema.default('/termos/privacidade'),
      VolunteerTerms: PageSchema.default('/termos/voluntariado'),
      UsageTerms: PageSchema.default('/termos/uso'),
      ApprovalTerms: PageSchema.default('/termos/aprovacao'),
      TermsList: PageSchema.default('/termos'),
      FAQ: PageSchema.default('/faq'),
      Viewer: PageSchema.default('/eu'),
      FAQQuestion: PageSchema.default('/faq/[id]'),
    })
    .default({}),
  social: Yup.array(
    Yup.object().shape({
      kind: Yup.string().required(),
      url: Yup.string()
        .url()
        .required(),
    }),
  ).default([]),
  config: Yup.object()
    .shape({
      popover: Yup.object()
        .shape({
          backgroundColor: Yup.string(),
        })
        .default({}),
      geo: Yup.object()
        .shape({
          default: Yup.object()
            .shape({
              region: Yup.string().required(),
              lat: Yup.number().required(),
              lng: Yup.number().required(),
            })
            .default({
              region: 'SP',
              lat: -23.5283838,
              lng: -46.6021955,
            }),
          regions: Yup.array(Yup.string()),
        })
        .default({}),
      footer: Yup.object()
        .shape({
          links: Yup.array(LinkSchema).default([]),
        })
        .default({}),
      user: Yup.object()
        .shape({
          createProject: Yup.boolean().default(false),
        })
        .default({}),
      user: Yup.object()
        .shape({
          documents: Yup.boolean().default(true),
          galleries: Yup.boolean().default(true),
          posts: Yup.boolean().default(true),
          documentsRestricted: Yup.boolean().default(false),
        })
        .default({}),

      project: Yup.object()
        .shape({
          galleries: Yup.boolean().default(true),
          posts: Yup.boolean().default(true),
          documents: Yup.boolean().default(true),
          documentsRestricted: Yup.boolean().default(false),
        })
        .default({}),
      organization: Yup.object()
        .shape({
          enabled: Yup.boolean().default(true),
        })
        .default({}),
      supportURL: Yup.string(),
      toolbar: Yup.object()
        .shape({
          links: Yup.array(LinkSchema).default([]),
        })
        .default({}),
      chat: Yup.object()
        .shape({
          enabled: Yup.boolean().default(false),
          beta: Yup.boolean().default(true),
        })
        .default({}),
      googleTagManager: Yup.object()
        .shape({
          id: Yup.string(),
        })
        .default(undefined),
      maps: Yup.object().shape({
        key: Yup.string(),
      }),
    })
    .required(),
})

module.exports = ChannelConfigSchema
