import React from 'react'
import Layout from '~/components/Layout'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import { defineMessages } from 'react-intl'
import { Page, PageAs } from '../common'
import Icon from '~/components/Icon'
import Link from 'next/link'
import Meta from '~/components/Meta'

const PageStyled = styled.div`
  margin-top: -200px;
`

const m = defineMessages({
  appName: {
    id: 'app.name',
    defaultMessage: 'Channel',
  },
})

const TermsPage: React.FC<{}> = () => {
  const intl = useIntl()

  return (
    <Layout toolbarProps={{ flat: true }}>
      <Meta title="Termos de Aprovação" />
      <div className="bg-gray-200">
        <div className="bg-primary-500 py-10" />
        <PageStyled>
          <div className="container container--md py-5">
            <div className="mb-2">
              <Link href={Page.TermsList} as={PageAs.TermsList()}>
                <a className="btn btn-text btn--size-4 tc-white px-0 bg-none">
                  <Icon name="arrow_back" className="mb-3 mr-2" />
                  Ver todos os termos
                </a>
              </Link>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-lg">
              <h1 className="h3 tl-base mb-4">
                DIRETRIZES DE APROVAÇÃO PARA
                <br />
                ORGANIZAÇÕES E VAGAS
              </h1>

              <p>
                A plataforma do {intl.formatMessage(m.appName)} é gratuita a
                todos os usuários. Sua organização social pode anunciar vagas de
                voluntariado para mais de 70 mil pessoas.
              </p>

              <p>
                Para aprovar o perfil de ONGs e movimentos sociais, além das
                vagas de voluntariado, seguimos os seguintes critérios:
              </p>

              <h4 className="h5">ONGs:</h4>

              <p>
                Publicamos em nosso site (www.atados.com.br) qualquer
                organização social localizada no Brasil, desde que seu cadastro
                contenha as seguintes informações:
              </p>

              <ul>
                <li>
                  <p>Qual o trabalho que desenvolve;</p>
                </li>
                <li>
                  <p>Qual o público/causa que atende/atua;</p>
                </li>
                <li>
                  <p>Onde está localizada;</p>
                </li>
                <li>
                  <p>
                    Qual a disponibilidade para recepcionar os(as)
                    voluntários(as).
                  </p>
                </li>
              </ul>

              <p>
                Podem usar a plataforma do {intl.formatMessage(m.appName)} como
                organização social: ONGs, movimentos, coletivos e grupos de
                voluntariado.Não é necessário possuir CNPJ, mas deve respeitar a
                Lei nº 9.608, que padroniza o Voluntariado.
              </p>

              <h4 className="h5">VAGAS:</h4>

              <p>Condições para aprovação de vagas</p>

              <p>Publicamos em nosso site vagas das seguintes localidades:</p>

              <ul>
                <li>
                  <p>Região metropolitana de São Paulo;</p>
                </li>
                <li>
                  <p>Grande Brasília (DF);</p>
                </li>
                <li>
                  <p>Grande Rio de Janeiro;</p>
                </li>
                <li>
                  <p>Grande Florianópolis;</p>
                </li>
                <li>
                  <p>Curitiba (PR).</p>
                </li>
              </ul>

              <p>
                <strong>
                  Nas demais regiões do Brasil só serão aprovadas vagas à
                  distância.
                </strong>
              </p>

              <p>
                Publicamos em nosso site vagas que tenham as seguintes
                informações na descrição.
              </p>

              <ul>
                <li>
                  <p>Qual atividade o voluntário irá realizar;</p>
                </li>
                <li>
                  <p>Qual a importância dessa atividade;</p>
                </li>
                <li>
                  <p>Qual o público beneficiado ou causa;</p>
                </li>
                <li>
                  <p>Onde a ação será realizada;</p>
                </li>
                <li>
                  <p>Quando a ação será realizada.</p>
                </li>
              </ul>

              <p>Restrições para aprovação de vagas</p>

              <ul>
                <li>
                  <p>
                    Não publicamos no site vagas que estejam relacionadas a
                    pregações religiosas, mesmo que seja atividade secundária;
                  </p>
                </li>
                <li>
                  <p>
                    Não publicamos em nosso site vagas para doação de bens
                    materiais, mas aprovamos vagas de captadores de recursos;
                  </p>
                </li>
                <li>
                  <p>
                    Não aprovamos vagas de organizações que não respondem as(os)
                    voluntárias(os);
                  </p>
                </li>
                <li>
                  <p>
                    Publicamos em nosso site vagas de campanha de doação de
                    sangue.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </PageStyled>
      </div>
    </Layout>
  )
}

TermsPage.displayName = 'TermsPage'

export default TermsPage
