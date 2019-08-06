const Yup = require('yup')

const LinkSchema = Yup.object().shape({
  href: Yup.string().required(),
  as: Yup.string(),
})

const ChannelConfigSchema = Yup.object().shape({
  id: Yup.string().required(),
  theme: Yup.object()
    .shape({
      colorPrimary: Yup.string().required(),
      colorSecondary: Yup.string().required(),
      popoverColor: Yup.string(),
      darkIcons: Yup.boolean(),
      footerBackground: Yup.string(),
      footerTheme: Yup.string().oneOf(['light', 'dark']),
      iconRating: Yup.string(),
      toolbarHeight: Yup.number().default(56),
    })
    .required(),
  assets: Yup.object()
    .shape({
      icon: Yup.string(),
      toolbarBrand: Yup.string(),
      links: Yup.array(Yup.object()).default([]),
      scripts: Yup.array(Yup.object()).default([]),
    })
    .required(),
  social: Yup.array(
    Yup.object().shape({
      kind: Yup.string().required(),
      url: Yup.string()
        .url()
        .required(),
    }),
  ).default([]),
  geo: Yup.object()
    .shape({
      default: Yup.object()
        .shape({
          region: Yup.string(),
          lat: Yup.number(),
          lng: Yup.number(),
        })
        .required(),
      regions: Yup.array(Yup.string()),
    })
    .required(),
  config: Yup.object()
    .shape({
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
      googleTagManager: Yup.object().shape({
        id: Yup.string(),
      }),
      maps: Yup.object().shape({
        key: Yup.string(),
      }),
    })
    .required(),
})

module.exports = ChannelConfigSchema
