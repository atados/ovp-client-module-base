import React from 'react'

jest.mock('~/common/channel-value', () => ({
  maps: { key: 'AIzaSyA6FtG9g5KebYrjsnA8iBtX4NDty3Rofp0' },
  googleTagManager: { id: 'GTM-NP5GCZB' },
  chat: { beta: true, enabled: false },
  toolbar: { links: [[Object]] },
  supportURL: 'https://atadoshelp.zendesk.com/hc/pt-br/requests/new',
  organization: { enabled: true },
  project: {
    documentsRestricted: false,
    documents: true,
    posts: true,
    galleries: true,
  },
  user: {
    documentsRestricted: false,
    posts: true,
    galleries: true,
    documents: true,
  },
  footer: {
    links: [[Object], [Object], [Object], [Object], [Object], [Object]],
  },
  geo: {
    default: {
      country: 'Brazil',
      region: 'SP',
      lat: -23.5283838,
      lng: -46.6021955,
    },
    regions: ['RJ', 'SP'],
  },
  popover: {},
  useDeviceLanguage: false,
  social: [
    {
      kind: 'facebook',
      url: 'https://www.facebook.com/atadosjuntandogenteboa/',
    },
    { kind: 'instagram', url: 'https://www.instagram.com/atados/' },
    { kind: 'github', url: 'https://github.com/atados' },
  ],
  pages: {
    Home: { pathname: '/', filename: 'home' },
    Project: { pathname: '/vaga/[slug]', filename: 'project' },
    About: { filename: 'about', pathname: '/sobre' },
  },
  assets: {
    ToolbarBrand: '/static/logo-dark.svg',
    Favicon: 'https://s3.amazonaws.com/atados-us/images/default-icon.ico',
    LogoDark: '/static/logo-dark.svg',
    LogoLight: '/static/logo-light.svg',
  },
  head: { scripts: [], links: [] },
  theme: {
    toolbarHeight: 56,
    color: {
      red: [Object],
      blue: [Object],
      green: [Object],
      gray: [Object],
      secondary: [Object],
      primary: [Object],
    },
  },
  id: 'default',
  search: { defaultOptions: [[Object], [Object], [Object], [Object]] },
  wpBlogUrl: 'https://blog.atados.com.br',
  sentry: { dsn: 'https://1257a4691eac4c97b7b03151308cebda@sentry.io/1777146' },
}))

jest.mock('~/components/Meta', () => props => (
  <div {...props}>~/components/Meta - {props.children}</div>
))
