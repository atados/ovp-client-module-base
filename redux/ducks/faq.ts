import { createAction, createReducer, PromiseAction } from 'redux-handy'
import { fetchAPI } from '~/lib/fetch/fetch.server'
import { unescapeHTML } from '~/lib/utils/string'
import { ReduxState } from '../root-reducer'

export interface Question {
  id: number
  question: string
  description: string
  answer: string
  category: QuestionCategory
}

export interface QuestionCategory {
  id: number
  name: string
  description: string
}

export const fetchFAQ = createAction<undefined, Question[]>(
  'FAQ_FETCH',
  (_, { getState, prevent }) => {
    const { faq } = getState() as ReduxState

    if (faq.fetched && !faq.error) {
      prevent()

      return faq.questions
    }

    return fetchAPI<Question[]>('/faq/')
  },
)

export interface FAQReducerState {
  fetching?: boolean
  fetched?: boolean
  error?: Error
  questions: Question[]
  categories: QuestionCategory[]
}

const RE_TAGS = /<(?:.|\n)*?>/gm
export default createReducer<FAQReducerState>(
  {
    [String(fetchFAQ)]: (state, action: PromiseAction<Question[]>) => {
      const questions =
        action.error || !action.payload
          ? state.questions
          : (action.payload as Question[]).map(question => ({
              ...question,
              description: unescapeHTML(
                question.answer.replace(RE_TAGS, ''),
              ).substr(0, 160),
            }))
      const categories: QuestionCategory[] = []
      const categoriesIds: number[] = []

      questions.forEach(question => {
        if (categoriesIds.indexOf(question.category.id) === -1) {
          let description: string = ''
          questions.some(q => {
            if (q.category.id === question.category.id) {
              description += description ? `, ${q.question}` : q.question
            }

            return description.length >= 160
          })

          question.category.description = description
          categories.push(question.category)
          categoriesIds.push(question.category.id)
        }
      })

      return {
        fetching: action.pending,
        fetched: state.fetched || !action.pending,
        categories,
        questions,
        error: action.error ? (action.payload as Error) : undefined,
      }
    },
  },
  {
    questions: [],
    categories: [],
  },
)
