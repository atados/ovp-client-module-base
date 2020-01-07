import React from 'react'
import Layout from '~/components/Layout'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import { defineMessages } from 'react-intl'
import Icon from '~/components/Icon'
import Link from 'next/link'
import { Page, PageAs } from '../common'
import Meta from '~/components/Meta'

const PageStyled = styled.div`
  background: #edf2f7;
  background-image: url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23002244' fill-opacity='0.15'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
`

const m = defineMessages({
  appName: {
    id: 'app.name',
    defaultMessage: 'Channel',
  },
})

const UsageTermsPage: React.FC<{}> = () => {
  const intl = useIntl()

  return (
    <Layout>
      <Meta title="Termos de Privacidade" />
      <PageStyled>
        <div className="container max-w-3xl py-8">
          <div className="mb-2">
            <Link href={Page.TermsList} as={PageAs.TermsList()}>
              <a className="btn btn-text btn--size-4">
                <Icon name="arrow_back" className="mb-4 mr-2" />
                Ver todos os termos
              </a>
            </Link>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-lg">
            <h1 className="h3">
              Política de privacidade para {intl.formatMessage(m.appName)}
            </h1>

            <p>
              Todas as suas informações pessoais recolhidas, serão usadas para o
              ajudar a tornar a sua visita no nosso site o mais produtiva e
              agradável possível.
            </p>

            <p>
              A garantia da confidencialidade dos dados pessoais dos
              utilizadores do nosso site é importante para o{' '}
              {intl.formatMessage(m.appName)}.
            </p>

            <p>
              Todas as informações pessoais relativas a membros, assinantes,
              clientes ou visitantes que usem o {intl.formatMessage(m.appName)}{' '}
              serão tratadas em concordância com a Lei da Proteção de Dados
              Pessoais de 26 de outubro de 1998 (Lei n.º 67/98).
            </p>

            <p>
              A informação pessoal recolhida pode incluir o seu nome, e-mail,
              número de telefone e/ou telemóvel, morada, data de nascimento e/ou
              outros.
            </p>

            <p>
              O uso do {intl.formatMessage(m.appName)} pressupõe a aceitação
              deste Acordo de privacidade. A equipa do{' '}
              {intl.formatMessage(m.appName)} reserva-se ao direito de alterar
              este acordo sem aviso prévio. Deste modo, recomendamos que
              consulte a nossa política de privacidade com regularidade de forma
              a estar sempre atualizado.
            </p>
            <br />

            <h2 className="h4">Os anúncios</h2>

            <p>
              Tal como outros websites, coletamos e utilizamos informação
              contida nos anúncios. A informação contida nos anúncios, inclui o
              seu endereço IP (Internet Protocol), o seu ISP (Internet Service
              Provider, como o Sapo, Clix, ou outro), o browser que utilizou ao
              visitar o nosso website (como o Internet Explorer ou o Firefox), o
              tempo da sua visita e que páginas visitou dentro do nosso website.
            </p>
            <br />
            <h2 className="h4">Os Cookies e Web Beacons</h2>

            <p>
              Utilizamos cookies para armazenar informação, tais como as suas
              preferências pessoas quando visita o nosso website. Isto poderá
              incluir um simples popup, ou uma ligação em vários serviços que
              providenciamos, tais como fóruns.
            </p>

            <p>
              Em adição também utilizamos publicidade de terceiros no nosso
              website para suportar os custos de manutenção. Alguns destes
              publicitários, poderão utilizar tecnologias como os cookies e/ou
              web beacons quando publicitam no nosso website, o que fará com que
              esses publicitários (como o Google através do Google AdSense)
              também recebam a sua informação pessoal, como o endereço IP, o seu
              ISP, o seu browser, etc. Esta função é geralmente utilizada para
              geotargeting (mostrar publicidade de Lisboa apenas aos leitores
              oriundos de Lisboa por ex.) ou apresentar publicidade direcionada
              a um tipo de utilizador (como mostrar publicidade de restaurante a
              um utilizador que visita sites de culinária regularmente, por
              ex.).
            </p>
            <p>
              Você detém o poder de desligar os seus cookies, nas opções do seu
              browser, ou efetuando alterações nas ferramentas de programas
              Anti-Virus, como o Norton Internet Security. No entanto, isso
              poderá alterar a forma como interage com o nosso website, ou
              outros websites. Isso poderá afetar ou não permitir que faça
              logins em programas, sites ou fóruns da nossa e de outras redes.
            </p>
            <br />
            <h2 className="h4">Ligações a Sites de terceiros</h2>

            <p>
              O {intl.formatMessage(m.appName)} possui ligações para outros
              sites, os quais, a nosso ver, podem conter informações /
              ferramentas úteis para os nossos visitantes. A nossa política de
              privacidade não é aplicada a sites de terceiros, pelo que, caso
              visite outro site a partir do nosso deverá ler a politica de
              privacidade do mesmo. Não nos responsabilizamos pela política de
              privacidade ou conteúdo presente nesses mesmos sites.
            </p>
          </div>
        </div>
      </PageStyled>
    </Layout>
  )
}

UsageTermsPage.displayName = 'UsageTermsPage'

export default UsageTermsPage
