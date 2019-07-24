import getConfig from 'next/config'
import { Channel } from '~/redux/ducks/channel'

export const {
  publicRuntimeConfig: {
    apiURL: API_URL,
    appURL: APP_URL,
    appShareURL: APP_SHARE_URL,
    socketApiURL: SOCKET_API_URL,
    socketApiWsURL: SOCKET_API_WS_URL,
    channelPages,
    channel,
  },
} = getConfig() as {
  publicRuntimeConfig: {
    channelId: string
    apiURL: string
    appURL: string
    appShareURL: string
    socketApiURL: string
    socketApiWsURL: string
    channelPages: string[]
    channel: Channel
  }
}

export const dev = process.env.NODE_ENV !== 'production'
export const meta = pageMeta => ({
  description: 'Basic app description',
  ...pageMeta,
  title: pageMeta.title ? `${pageMeta.title} - App name` : 'App name',
})

export const colors = [
  '#2D728F',
  '#3B8EA5',
  '#f85a40',
  '#F49E4C',
  '#AB3428',
  '#995D81',
  '#484A47',
]

export const regionLongNameMap = {
  AC: 'Acre',
  AL: 'Alagoas',
  AP: 'Amapá',
  AM: 'Amazonas',
  BA: 'Bahia',
  CE: 'Ceará',
  DF: 'Distrito Federal',
  ES: 'Espírito Santo',
  GO: 'Goiás',
  MA: 'Maranhão',
  MT: 'Mato Grosso',
  MS: 'Mato Grosso do Sul',
  MG: 'Minas Gerais',
  PA: 'Pará',
  PB: 'Paraíba',
  PR: 'Paraná',
  PE: 'Pernambuco',
  PI: 'Piauí',
  RJ: 'Rio de Janeiro',
  RN: 'Rio Grande do Norte',
  RS: 'Rio Grande do Sul',
  RO: 'Rondônia',
  RR: 'Roraima',
  SC: 'Santa Catarina',
  SP: 'São Paulo',
  SE: 'Sergipe',
  TO: 'Tocantins',
  '3': 'Acre',
  '4': 'Alagoas',
  '5': 'Amapá',
  '6': 'Amazonas',
  '7': 'Bahia',
  '8': 'Ceará',
  '9': 'Distrito Federal',
  '10': 'Espírito Santo',
  '11': 'Goiás',
  '12': 'Maranhão',
  '13': 'Mato Grosso',
  '14': 'Mato Grosso do Sul',
  '15': 'Minas Gerais',
  '16': 'Pará',
  '17': 'Paraíba',
  '18': 'Paraná',
  '19': 'Pernambuco',
  '20': 'Piauí',
  '21': 'Rio de Janeiro',
  '22': 'Rio Grande do Norte',
  '23': 'Rio Grande do Sul',
  '24': 'Rondônia',
  '25': 'Roraima',
  '26': 'Santa Catarina',
  '27': 'São Paulo',
  '28': 'Sergipe',
  '29': 'Tocantins',
}
