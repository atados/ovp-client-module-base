const Yup = require('yup')
const defaults = require('../app.default.json')

const LinkSchema = Yup.object({
  href: Yup.string().required(),
  as: Yup.string(),
})

const ColorSchema = Yup.object({
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

const createShapeFromObject = (obj, schemaOrFn) => {
  const isFn = typeof schemaOrFn === 'function'

  Object.keys(obj).reduce((shape, key) => {
    shape[key] = isFn ? schemaOrFn(obj[key]) : schemaOrFn.default(obj[key])
    return shape
  }, {})
}

const ChannelConfigSchema = Yup.object({
  id: Yup.string().required(),

  theme: Yup.object({
    color: Yup.object(
      createShapeFromObject(defaults.theme.color, ColorSchema),
    ).default({}),
    darkIcons: Yup.boolean(),
  }).default({}),

  head: Yup.object({
    links: Yup.array(Yup.object({ href: Yup.string().required() })).default([]),
    scripts: Yup.array(Yup.object({ href: Yup.string().required() })).default(
      [],
    ),
  }).default({}),

  assets: Yup.object({
    logoLight: Yup.string().default('/static/logo-light.svg'),
    logoDark: Yup.string().default('/static/logo-dark.svg'),
    favicon: Yup.string(),
  }).default({}),

  pages: Yup.object(
    createShapeFromObject(defaults.pages, page =>
      Yup.object({
        pathname: Yup.string().default(page.pathname),
        filename: Yup.string().default(page.filename),
        query: Yup.object().default(page.query),
      }).default(page),
    ),
  ).default({}),

  social: Yup.array(
    Yup.object({
      kind: Yup.string().required(),
      url: Yup.string()
        .url()
        .required(),
    }),
  ).default([]),

  useDeviceLanguage: Yup.boolean().default(true),

  popover: Yup.object({
    backgroundColor: Yup.string(),
  }).default({}),

  geolocation: Yup.object({
    default: Yup.object({
      countryCode: Yup.string().required(),
      regionCode: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
    }).required(),
  }).required(),

  footer: Yup.object({
    links: Yup.array(LinkSchema).default([]),
    background: Yup.string(),
    brand: Yup.string(),
    theme: Yup.string().oneOf(['light', 'dark']),
  }).default({}),

  user: Yup.object({
    createProject: Yup.boolean().default(false),
  }).default({}),

  project: Yup.object({
    galleries: Yup.boolean().default(true),
    posts: Yup.boolean().default(true),
    documents: Yup.boolean().default(true),
    documentsRestricted: Yup.boolean().default(false),
  }).default({}),
  user: Yup.object({
    documents: Yup.boolean().default(true),
    galleries: Yup.boolean().default(true),
    posts: Yup.boolean().default(true),
    documentsRestricted: Yup.boolean().default(false),
  }).default({}),

  project: Yup.object({
    galleries: Yup.boolean().default(true),
    posts: Yup.boolean().default(true),
    documents: Yup.boolean().default(true),
    documentsRestricted: Yup.boolean().default(false),
  }).default({}),
  organization: Yup.object({
    enabled: Yup.boolean().default(true),
  }).default({}),

  supportURL: Yup.string(),

  toolbar: Yup.object({
    brand: Yup.string(),
    height: Yup.number().default(56),
    links: Yup.array(LinkSchema).default([]),
  }).default({}),

  chat: Yup.object({
    enabled: Yup.boolean().default(false),
    beta: Yup.boolean().default(true),
  }).default({}),

  googleTagManager: Yup.object({
    id: Yup.string(),
  }).default(undefined),

  maps: Yup.object({
    key: Yup.string(),
  }),

  emailConfirmation: Yup.object({
    warning: Yup.boolean().default(true),
  }).default({}),
})

module.exports = ChannelConfigSchema
