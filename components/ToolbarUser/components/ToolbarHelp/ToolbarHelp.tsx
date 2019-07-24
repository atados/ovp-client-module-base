import escapeRegExp from 'escape-string-regexp'
import React from 'react'
import { InjectedIntlProps } from 'react-intl'
import { connect } from 'react-redux'
import reactStringReplace from 'react-string-replace'
import styled from 'styled-components'
import { channel } from '~/common/constants'
import ActivityIndicator from '~/components/ActivityIndicator'
import Icon from '~/components/Icon'
import ToolbarDropdown from '~/components/ToolbarUser/components/ToolbarDropdown'
import { withIntl } from '~/lib/intl'
import { createAccentFriendlyRegexp } from '~/lib/regex/utils'
import { fetchFAQ, Question, QuestionCategory } from '~/redux/ducks/faq'
import { RootState } from '~/redux/root-reducer'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const Body = styled.div`
  overflow-y: scroll;
  flex: 1 1 auto;
`

const Header = styled.div`
  border-bottom: 1px solid #ddd;
  height: 36px;
  min-height: 36px;
  max-height: 36px;
`

const CategoryItem = styled.button`
  background: none;
  font-size: 18px;
  font-weight: normal;
  display: block;
  width: 100%;
  text-align: left;
  padding: 16px 0;
  border-bottom: 1px solid #ddd;

  &:hover > .title {
    text-decoration: underline;
  }
`

const SearchForm = styled.form`
  background: #f5f7f9;
  border-bottom: 1px solid #e3e9ec;
`

const BackButton = styled.button`
  background: none;

  &:focus {
    box-shadow: none;
  }
`

const QuestionItem = styled.button`
  background: none;
  font-size: 16px;
  font-weight: normal;
  display: block;
  width: 100%;
  text-align: left;
  padding: 16px 0;
  border-bottom: 1px solid #ddd;
  color: ${props => props.theme.colorPrimary};

  &:hover > .title {
    text-decoration: underline;
  }
`

const Match = styled.span`
  background: rgba(0, 112, 224, 0.1);
  font-weight: 500;
`

const Input = styled.input``

interface ToolbarHelpDropdownProps {
  readonly fetching: boolean
  readonly className?: string
  readonly button: React.ReactElement<any>
  readonly onFetchQuestions: () => void
  readonly questions: Question[]
  readonly categories: QuestionCategory[]
}

interface ToolbarHelpDropdownProps {
  readonly className?: string
}

interface SearchResult {
  questionId: number
  index: number
  title: React.ReactNode | string
  description: React.ReactNode | string
}
interface ToolbarHelpDropdownState {
  selectedCategory?: QuestionCategory
  selectedQuestion?: Question
  inputValue: string
  searchResults: SearchResult[]
}

class ToolbarHelpDropdown extends React.Component<
  ToolbarHelpDropdownProps & InjectedIntlProps,
  ToolbarHelpDropdownState
> {
  constructor(props) {
    super(props)

    this.state = {
      searchResults: [],
      selectedCategory: undefined,
      selectedQuestion: undefined,
      inputValue: '',
    }
  }

  public selectCategory = (selectedCategory: QuestionCategory) => {
    this.setState({ selectedCategory })
  }

  public selectQuestion = (selectedQuestion: Question) => {
    this.setState({ selectedQuestion })
  }

  public selectFromSearchResult = (resultItem: SearchResult) => {
    const question = this.props.questions.find(
      q => q.id === resultItem.questionId,
    )

    if (question) {
      this.setState({
        inputValue: '',
        selectedCategory: question.category,
        selectedQuestion: question,
      })
    }
  }

  public reset = () => {
    this.setState({
      selectedQuestion: undefined,
      selectedCategory: undefined,
    })
  }

  public back = () => {
    if (this.state.selectedQuestion) {
      this.setState({ selectedQuestion: undefined })
      return
    }

    if (this.state.selectedCategory) {
      this.setState({ selectedCategory: undefined })
    }
  }

  public renderMatch = (match: string, i) => <Match key={i}>{match}</Match>

  public handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = event.target
    let searchResults: SearchResult[] = []

    if (inputValue) {
      const { questions } = this.props
      const inputValueRegex = createAccentFriendlyRegexp(
        `(${escapeRegExp(inputValue)})`,
        'gi',
      )
      questions.forEach(question => {
        let index = -1
        let title: string | React.ReactNode = question.question
        let description: React.ReactNodeArray | string = question.description

        if (inputValueRegex.test(question.question)) {
          index += 2
          title = reactStringReplace(
            question.question,
            inputValueRegex,
            this.renderMatch,
          )
        }

        if (
          inputValueRegex.test(question.answer) ||
          inputValueRegex.test(question.description)
        ) {
          index += 1
          description = reactStringReplace(
            description,
            inputValueRegex,
            this.renderMatch,
          )
        }

        if (index === -1) {
          return
        }

        searchResults.push({
          questionId: question.id,
          index,
          title,
          description,
        })
      })

      searchResults = searchResults.sort(
        (question1, question2) => question2.index - question1.index,
      )
    }

    this.setState({ inputValue, searchResults })
  }

  public renderFallback = () =>
    !this.props.fetching && (
      <div className="px-2 py-4 ta-center">
        <h4 className="tw-medium ts-medium mb-1">
          Não encontramos uma resposta :(
        </h4>
        {channel.config.supportURL && (
          <>
            <p className="tc-muted-dark">
              Mas não se preocupe, ainda podemos te ajudar!
            </p>
            <a
              href={channel.config.supportURL}
              className="btn btn-primary"
              target="__blank"
            >
              <Icon name="mail" /> Entre em contato conosco
            </a>
          </>
        )}
      </div>
    )

  public render() {
    const {
      questions,
      categories,
      className,
      fetching,
      onFetchQuestions,
    } = this.props
    const {
      selectedCategory,
      selectedQuestion,
      inputValue,
      searchResults,
    } = this.state
    let body: React.ReactNode = null

    if (inputValue) {
      body = (
        <>
          <h4 className="ts-small tw-medium tc-muted mb-1">Resultados</h4>
          {searchResults.length > 0
            ? searchResults.map(resultItem => (
                <QuestionItem
                  key={resultItem.questionId}
                  className="btn"
                  onClick={() => this.selectFromSearchResult(resultItem)}
                >
                  <span className="title d-block mb-1">{resultItem.title}</span>
                  <span className="d-block tc-muted text-truncate ts-small">
                    {resultItem.description}
                  </span>
                </QuestionItem>
              ))
            : this.renderFallback()}
        </>
      )
    } else if (!selectedCategory) {
      body = (
        <>
          <h4 className="ts-small tw-medium tc-muted mb-1">Tópicos</h4>
          {categories.length
            ? categories.map(category => (
                <CategoryItem
                  key={category.id}
                  className="btn"
                  onClick={() => this.selectCategory(category)}
                >
                  <Icon name="arrow_forward" className="float-right" />
                  <span className="title d-block mb-1">{category.name}</span>
                  <span className="d-block tc-muted text-truncate ts-small">
                    {}
                  </span>
                </CategoryItem>
              ))
            : this.renderFallback()}
        </>
      )
    } else if (!selectedQuestion) {
      body = (
        <>
          <h4 className="ts-small tc-muted mb-1">
            <button
              type="button"
              className="tl-heading td-hover-underline btn-plain-text tw-medium tc-muted"
              onClick={this.reset}
            >
              Tópicos
            </button>
            <Icon name="chevron_right" />
            <span className="tc-base">{selectedCategory.name}</span>
          </h4>
          {questions
            .filter(question => question.category.id === selectedCategory.id)
            .map(question => (
              <QuestionItem
                key={question.id}
                className="btn"
                onClick={() => this.selectQuestion(question)}
              >
                <span className="title d-block mb-1">{question.question}</span>
                <span
                  className="d-block tc-muted text-truncate ts-small"
                  dangerouslySetInnerHTML={{ __html: question.description }}
                />
              </QuestionItem>
            ))}
        </>
      )
    } else {
      body = (
        <>
          <h4 className="ts-small tc-muted mb-1 text-truncate mb-3">
            <button
              type="button"
              className="tl-heading td-hover-underline btn-plain-text tw-medium tc-muted"
              onClick={this.reset}
            >
              Tópicos
            </button>
            <Icon name="chevron_right" />
            <button
              type="button"
              className="tl-heading td-hover-underline btn-plain-text tw-medium tc-muted"
              onClick={this.back}
            >
              {selectedCategory.name}
            </button>
            <Icon name="chevron_right" />
            <span className="tc-base">{selectedQuestion.question}</span>
          </h4>
          <h3 className="tw-norma ts-large mb-3">
            {selectedQuestion.question}
          </h3>
          <div dangerouslySetInnerHTML={{ __html: selectedQuestion.answer }} />
        </>
      )
    }

    return (
      <ToolbarDropdown
        menuWidth="400px"
        menuHeight="500px"
        onOpen={onFetchQuestions}
        className={className}
        title="Dúvidas"
        icon={<Icon name="help" />}
      >
        <Container>
          <Header>
            <BackButton className="btn" onClick={this.back}>
              <Icon name="arrow_back" className="mr-2" />
              Voltar
            </BackButton>
          </Header>
          <Body>
            <SearchForm className="p-2">
              <Input
                type="text"
                className="input input--size-3"
                placeholder="Qual sua dúvida?"
                value={inputValue}
                onChange={this.handleQueryChange}
              />
            </SearchForm>
            <div className="p-2">
              {body}
              {fetching && (
                <div className="ta-center py-3">
                  <ActivityIndicator size={48} />
                </div>
              )}
            </div>
          </Body>
        </Container>
      </ToolbarDropdown>
    )
  }
}

const mapStateToProps = ({
  faq,
}: RootState): Partial<ToolbarHelpDropdownProps> => ({
  fetching: !faq.fetched || faq.fetching,
  questions: faq.questions,
  categories: faq.categories,
})

const mapDispatchToProps = (dispatch): Partial<ToolbarHelpDropdownProps> => ({
  onFetchQuestions: () => dispatch(fetchFAQ(undefined)),
})

export default withIntl(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ToolbarHelpDropdown),
)
