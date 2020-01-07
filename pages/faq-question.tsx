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
import FAQSupport from '../components/FAQ/FAQSupport'

const Answer = styled.div`
  font-size: 18px;
`

interface FaqQuestionPageProps {
  readonly questionId: number
}

const FaqQuestionPage: NextPage<FaqQuestionPageProps> = ({ questionId }) => {
  const faqQuery = useFetchAPI<Question[]>('/faq/')
  const questions = faqQuery?.data || []
  const question = questions.find(q => q.id === questionId)

  return (
    <FAQLayout>
      <Meta />
      <div className="bg-gray-200 py-8">
        <div className="container px-2">
          <div className="bg-white rounded-lg px-4 py-8 md:px-8 shadow">
            {question && (
              <div className="container max-w-3xl">
                <div className="mb-4 truncate">
                  <Link href={Page.FAQ}>
                    <a className="text-gray-500">FAQ</a>
                  </Link>
                  <Icon name="chevron_right" className="text-gray-500 mx-1" />
                  <span className="text-gray-500">
                    {question.category.name}
                  </span>
                  <Icon name="chevron_right" className="text-gray-500 mx-1" />
                  <span className="text-gray-500">{question.question}</span>
                </div>
                <h1 className="text-3xl mb-4 leading-relaxed">
                  {question.question}
                </h1>
                <Answer
                  dangerouslySetInnerHTML={{ __html: question.answer }}
                  className="mb-12"
                />
              </div>
            )}
          </div>
          <div className="container max-w-3xl mt-6">
            <FAQSupport />
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
