import { NextPage } from 'next'
import React from 'react'
import Meta from '~/components/Meta'
import useFetchAPI from '~/hooks/use-fetch-api'
import { Question } from '~/redux/ducks/faq'
import styled from 'styled-components'
import Link from 'next/link'
import { Page } from '~/common/page'
import FAQLayout from '~/components/FAQ/FAQLayout'
import Icon from '~/components/Icon'
import { channel } from '../common/constants'

const Answer = styled.div`
  font-size: 18px;
`

interface FaqQuestionPageProps {
  readonly questionId: number
}

const FaqQuestionPage: NextPage<FaqQuestionPageProps> = ({ questionId }) => {
  const faqQuery = useFetchAPI<Question[]>('/faq/')
  const questions = faqQuery.data ? faqQuery.data : []
  const question = questions.find(q => q.id === questionId)

  return (
    <FAQLayout>
      <Meta />
      <div className="bg-gray-200 py-5">
        <div className="container">
          <div className="bg-white rounded-lg p-5 shadow">
            {question && (
              <div className="container container--md py-5">
                <div className="mb-3 text-truncate">
                  <Link href={Page.FAQ}>
                    <a className="tc-gray-500">FAQ</a>
                  </Link>
                  <Icon name="chevron_right" className="tc-gray-500 mx-1" />
                  <span className="tc-gray-500">ONGs</span>
                  <Icon name="chevron_right" className="tc-gray-500 mx-1" />
                  <span className="tc-gray-500">{question.question}</span>
                </div>
                <h1>{question.question}</h1>
                <Answer
                  dangerouslySetInnerHTML={{ __html: question.answer }}
                  className="mb-5"
                />
                {channel.config.supportURL && (
                  <div className="bg-gray-200 p-5 rounded-lg ta-center">
                    <p className="tc-gray-500">Ainda precisa de ajuda?</p>
                    <a
                      href={channel.config.supportURL}
                      target="__blank"
                      className="btn bg-gray-400 hover:bg-gray-500 tc-gray-600 hover:tc-gray-700"
                    >
                      Entre em contato com nosso suporte
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </FAQLayout>
  )
}

FaqQuestionPage.displayName = 'FaqQuestionPage'
FaqQuestionPage.getInitialProps = ({ query }) =>
  Promise.resolve({
    questionId: parseInt(query.id as any, 10),
  })

export default FaqQuestionPage
