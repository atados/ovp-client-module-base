import React from 'react'
import Layout from '~/components/Layout'
import styled from 'styled-components'
import Icon from '../components/Icon'
import Link from 'next/link'
import { Page, PageAs } from '../common'
import Meta from '../components/Meta'

const PageStyled = styled.div`
  background: #edf2f7;
  background-image: url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23002244' fill-opacity='0.15'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
`

const UsageTermsPage: React.FC<{}> = () => (
  <Layout>
    <Meta title="Termos de Voluntariado" />
    <PageStyled>
      <div className="container container--md py-5">
        <div className="mb-2">
          <Link href={Page.TermsList} as={PageAs.TermsList()}>
            <a className="btn btn-text btn--size-4">
              <Icon name="arrow_back" className="mb-3 mr-2" />
              Ver todos os termos
            </a>
          </Link>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-lg">
          <h1 className="h3 text-center">Termo de Voluntariado</h1>
          <p>
            1. Pelo presente Termo de Adesão, o VOLUNTÁRIO decide
            espontaneamente realizar atividade voluntária na ORGANIZAÇÃO, nos
            termos e condições claramente expostas no programa de voluntariado
            ora anunciado e aceito, ciente do disposto na Lei nº 9.608, de
            18/02/1998.
          </p>
          <p className="pl-5">
            1.1.1. O VOLUNTÁRIO declara que o mesmo não é atividade remunerada,
            não representa vínculo empregatício nem gera obrigações de natureza
            trabalhista, previdenciária ou afim.
          </p>
          <p className="pl-5">
            1.1.2. Declara, ainda, ter ciência de que eventuais danos pessoais
            ou materiais no exercício do voluntariado não serão imputados à
            ORGANIZAÇÃO ou ao ATADOS, assumindo desde já integral
            responsabilidade pelos riscos.
          </p>

          <p>
            2. O VOLUNTÁRIO cede à ORGANIZAÇÃO e ao ATADOS, à título gratuito,
            os direitos de uso de imagem relativos às fotografias e gravações
            realizadas durante o programa de voluntariado para difusão
            publicitária, midiática e para quaisquer outros usos que a
            ORGANIZAÇÃO e o ATADOS julgarem convenientes. A cessão dos direitos
            de uso dessas imagens será por prazo indeterminado, sem restrições
            territoriais, para todo e qualquer veículo de mídia (online e
            off-line), exclusivamente com a finalidade de divulgação dos
            trabalhos objeto deste termo.
          </p>

          <hr />
          <p className="ts-small tc-muted-dark">
            Art. 1º Considera-se serviço voluntário, para os fins desta Lei, a
            atividade não remunerada prestada por pessoa física a entidade
            pública de qualquer natureza ou a instituição privada de fins não
            lucrativos que tenha objetivos cívicos, culturais, educacionais,
            científicos, recreativos ou de assistência à pessoa. Parágrafo
            único. O serviço voluntário não gera vínculo empregatício, nem
            obrigação de natureza trabalhista previdenciária ou afim.
            <br />
            Art. 2º O serviço voluntário será exercido mediante a celebração de
            termo de adesão entre a entidade, pública ou privada, e o prestador
            do serviço voluntário, dele devendo constar o objeto e as condições
            de seu exercício.
            <br />
            Art. 3º O prestador do serviço voluntário poderá ser ressarcido
            pelas despesas que comprovadamente realizar no desempenho das
            atividades voluntárias. Parágrafo único. As despesas a serem
            ressarcidas deverão estar expressamente autorizadas pela entidade a
            que for prestado o serviço voluntário.
            <br />
            Art. 4º Esta Lei entra em vigor na data de sua publicação. <br />
            Art. 5º Revogam-se as disposições em contrário.
            (http://www.planalto.gov.br/ccivil_03/LEIS/L9608compilado.htm)
          </p>
        </div>
      </div>
    </PageStyled>
  </Layout>
)

UsageTermsPage.displayName = 'UsageTermsPage'

export default UsageTermsPage
