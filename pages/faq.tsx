import React, { useMemo } from 'react'
import FAQPageQuestionItem from '~/components/FAQPageQuestionItem'
import Meta from '~/components/Meta'
import useFetchAPI from '~/hooks/use-fetch-api'
import { Question, QuestionCategory } from '~/redux/ducks/faq'
import FAQLayout from '../components/FAQ/FAQLayout'
import { channel } from '../common/constants'
import { NextPage } from 'next'
import { createAccentFriendlyRegexp } from '../lib/regex/utils'
import Icon from '../components/Icon'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/root-reducer'
import { FormattedMessage } from 'react-intl'

interface FAQPageProps {
  readonly filterQuery: string
}

const FaqPage: NextPage<FAQPageProps> = ({ filterQuery }) => {
  const intl = useSelector((reduxState: RootState) => reduxState.intl)
  const faqQuery = useFetchAPI<Question[]>(`/faq/?language=${intl.locale}`)
  const questions = useMemo(() => {
    if (faqQuery.data) {
      if (filterQuery) {
        const filterRegex = createAccentFriendlyRegexp(filterQuery, 'gi')
        return faqQuery.data.filter(
          question =>
            filterRegex.test(question.description) ||
            filterRegex.test(question.answer) ||
            filterRegex.test(question.question),
        )
      }

      return faqQuery.data
    }

    return []
  }, [faqQuery, filterQuery])
  const categories = useMemo(() => {
    const categoriesListIds: number[] = []
    const categoriesList: QuestionCategory[] = []
    questions.forEach(question => {
      // Push to categoriesList if category was not seen before
      if (!categoriesListIds.includes(question.category.id)) {
        categoriesListIds.push(question.category.id)
        categoriesList.push(question.category)
      }
    })

    return categoriesList
  }, [questions])

  return (
    <FAQLayout defaultSearchFormValue={filterQuery}>
      <Meta />
      <div className="py-5 bg-gray-300">
        <div className="container">
          <div className="bg-white rounded-lg p-5 shadow">
            {filterQuery && (
              <div className="mb-5 px-2 text-truncate block">
                <div className="media">
                  <Icon name="search" className="mr-3 h2" />
                  <div className="media-body">
                    <h1 className="h2 mb-2">Resultados para "{filterQuery}"</h1>
                    <span className="tc-gray-500">
                      {questions.length} resultados
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div className="row">
              {categories.length === 0 && (
                <div className="max-w-md mx-auto py-4 ta-center">
                  <Icon
                    name="import_contacts"
                    className="text-6xl tc-gray-600"
                  />
                  <h2 className="text-2xl tw-normal leading-relaxed">
                    <FormattedMessage
                      id="pages.faq.noRegisteredQuestions.title"
                      defaultMessage="Ainda não há perguntas registradas nessa lingua"
                    />
                  </h2>
                </div>
              )}
              {categories.map(category => (
                <div key={category.id} className="col-lg-4">
                  <h5 className="tw-medium block px-2">{category.name}</h5>
                  {questions
                    .filter(question => question.category.id === category.id)
                    .map(question => (
                      <FAQPageQuestionItem
                        key={question.id}
                        question={question}
                      />
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="container container--md mt-5">
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
      </div>
    </FAQLayout>
  )
}

FaqPage.displayName = 'FaqPage'
FaqPage.getInitialProps = async ctx => ({
  filterQuery: ctx.query.query && String(ctx.query.query),
})

export default FaqPage
