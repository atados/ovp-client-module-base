import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import { Question } from '~/redux/ducks/faq'
import { PageAs, Page } from '../common'
import stripTags from 'striptags'

const Anchor = styled.a`
  &:hover {
    text-decoration: none;

    > span {
      text-decoration: underline;
    }
  }
`

const Description = styled.p`
  max-height: 76px;
  overflow: hidden;

  ul,
  p,
  ol {
    display: inline;
    list-style: none;
    padding: 0;
    margin: 0;
  }
`

interface FAQPageQuestionItemProps {
  readonly className?: string
  readonly question: Question
}

const FAQPageQuestionItem: React.FC<FAQPageQuestionItemProps> = ({
  className,
  question,
}) => (
  <Link
    href={Page.FAQQuestion}
    as={PageAs.FAQQuestion({ id: question.id })}
    passHref
  >
    <Anchor
      className={`${className || ''} block hover:bg-primary-100 rounded-lg p-2`}
    >
      <span className="tc-primary-500 tw-medium">{question.question}</span>
      <Description
        className="tc-muted m-0"
        dangerouslySetInnerHTML={{ __html: stripTags(question.answer) }}
      />
    </Anchor>
  </Link>
)

FAQPageQuestionItem.displayName = 'FAQPageQuestionItem'

export default FAQPageQuestionItem
