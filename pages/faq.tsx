import React, { useMemo } from 'react'
import FAQPageQuestionItem from '~/components/FAQPageQuestionItem'
import Meta from '~/components/Meta'
import useFetchAPI from '~/hooks/use-fetch-api'
import { Question, QuestionCategory } from '~/redux/ducks/faq'
import FAQLayout from '~/components/FAQ/FAQLayout'
import { NextPage } from 'next'
import { createAccentFriendlyRegexp } from '../lib/regex/utils'
import Icon from '~/components/Icon'
import { FormattedMessage } from 'react-intl'
import FAQSupport from '../components/FAQ/FAQSupport'
import { AppIntl } from '~/lib/intl'

interface FAQPageProps {
  readonly filterQuery: string
}

const FaqPage: NextPage<FAQPageProps> = ({ filterQuery }) => {
  const faqQuery = useFetchAPI<Question[]>(`/faq/?language=${AppIntl.locale}`)
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
        <div className="container px-2">
          <div className="bg-white rounded-lg px-4 py-8 md:px-8 shadow">
            {filterQuery && (
              <div className="mb-12 px-3 truncate block">
                <div className="media">
                  <Icon name="search" className="mr-4 h2" />
                  <div className="media-body">
                    <h1 className="h2 mb-2">Resultados para "{filterQuery}"</h1>
                    <span className="text-gray-500">
                      {questions.length} resultados
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div className="lg:flex -mx-2">
              {categories.length === 0 && (
                <div className="max-w-md mx-auto py-5 text-center">
                  <Icon
                    name="import_contacts"
                    className="text-6xl text-gray-600"
                  />
                  <h2 className="text-2xl font-normal leading-relaxed">
                    <FormattedMessage
                      id="pages.faq.noRegisteredQuestions.title"
                      defaultMessage="Ainda não há perguntas registradas nessa lingua"
                    />
                  </h2>
                </div>
              )}
              {categories.map(category => (
                <div key={category.id} className="w-full lg:w-1/3 px-2 mb-6">
                  <h5 className="font-medium block px-3">{category.name}</h5>
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
        <div className="container max-w-3xl mt-6">
          <FAQSupport />
        </div>
      </div>
    </FAQLayout>
  )
}

FaqPage.displayName = 'FaqPage'
FaqPage.getInitialProps = async ctx =>
  ({
    filterQuery: ctx.query.query && String(ctx.query.query),
  } as any)

export default FaqPage
