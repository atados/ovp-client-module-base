const Yup = require('yup')
const defaultPages = require('../pages.default.json')

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
const PagesShape = {}

Object.keys(defaultPages || {}).forEach(pageName => {
  PagesShape[pageName] = PageSchema.default(defaultPages[pageName])
})

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
          green: ColorSchema.default({
            100: '#f0fff4',
            200: '#c6f6d5',
            300: '#9ae6b4',
            400: '#68d391',
            500: '#48bb78',
            600: '#38a169',
            700: '#2f855a',
            800: '#276749',
            900: '#22543d',
          }),
          blue: ColorSchema.default({
            100: '#ebf8ff',
            200: '#bee3f8',
            300: '#90cdf4',
            400: '#63b3ed',
            500: '#4299e1',
            600: '#3182ce',
            700: '#2b6cb0',
            800: '#2c5282',
            900: '#2a4365',
          }),
          red: ColorSchema.default({
            100: '#fff5f5',
            200: '#fed7d7',
            300: '#feb2b2',
            400: '#fc8181',
            500: '#f56565',
            600: '#e53e3e',
            700: '#c53030',
            800: '#9b2c2c',
            900: '#742a2a',
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
      LogoLight: Yup.string().default('/static/logo-light.svg'),
      LogoDark: Yup.string().default('/static/logo-dark.svg'),
      Favicon: Yup.string(),
      ToolbarBrand: Yup.string(),
      FooterBrand: Yup.string(),
    })
    .default({}),
  pages: Yup.object()
    .shape(PagesShape)
    .default({}),
  social: Yup.array(
    Yup.object().shape({
      kind: Yup.string().required(),
      url: Yup.string()
        .url()
        .required(),
    }),
  ).default([]),

  useDeviceLanguage: Yup.boolean().default(true),
  popover: Yup.object()
    .shape({
      backgroundColor: Yup.string(),
    })
    .default({}),
  geo: Yup.object()
    .shape({
      default: Yup.object()
        .shape({
          country: Yup.string().required(),
          region: Yup.string().required(),
          lat: Yup.number().required(),
          lng: Yup.number().required(),
        })
        .default({
          country: 'BR',
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
  project: Yup.object()
    .shape({
      galleries: Yup.boolean().default(true),
      posts: Yup.boolean().default(true),
      documents: Yup.boolean().default(true),
      documentsRestricted: Yup.boolean().default(false),
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
  emailConfirmation: Yup.object()
    .shape({
      warning: Yup.boolean().default(true),
    })
    .default({}),
})

module.exports = ChannelConfigSchema
