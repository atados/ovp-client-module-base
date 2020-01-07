import gql from 'graphql-tag'
import React from 'react'
import { useMutation } from 'react-apollo-hooks'
import Textarea from 'react-textarea-autosize'
import styled from 'styled-components'
import { generateRandomId } from '~/lib/utils/string'
import {
  InboxViewer,
  InboxViewerKind,
  Message,
  MessageThreadType,
} from '~/redux/ducks/inbox'
import Icon from '../Icon'
import { InboxPendingMessage } from './InboxConversation'

const { useState } = React

const Container = styled.form`
  border-top: 1px solid #ccc;
  padding: 12px 16px 20px;
`

const TextareaStyled = styled(Textarea)`
  padding-right: 40px;
`

const SendButton = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
`

const GQL_ADD_MESSAGE = gql`
  mutation InboxConversationForm(
    $threadId: String!
    $body: String!
    $senderId: Int
    $senderKind: String
  ) {
    addMessage(
      threadId: $threadId
      body: $body
      senderId: $senderId
      senderKind: $senderKind
    ) {
      errors {
        name
        path
      }
      payload {
        threadId
        body
        createdAt
      }
    }
  }
`

interface InboxConversationFormProps {
  readonly viewer: InboxViewer
  readonly thread: MessageThreadType
  readonly setMessages: (newState: React.SetStateAction<Message[]>) => any
  readonly className?: string
}

interface InboxConversationFormState {
  readonly inputValue: string
}

const InboxConversationForm: React.FunctionComponent<InboxConversationFormProps> = ({
  thread,
  viewer,
  setMessages,
  className,
}) => {
  const [state, setState] = useState<InboxConversationFormState>({
    inputValue: '',
  })
  const addMessage = useMutation(GQL_ADD_MESSAGE)

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target

    setState({ inputValue: value })
  }

  const handleInputKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.keyCode === 13) {
      event.preventDefault()
      submit()
    }
  }

  const submit = (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault()
    }

    if (state.inputValue.trim().length > 0) {
      const variables: InboxPendingMessage = {
        threadId: thread.id,
        body: state.inputValue,
        senderId: parseInt(viewer.id, 10),
        senderKind:
          viewer.kind === InboxViewerKind.Organization
            ? 'organization'
            : 'user',
      }
      setMessages(currentMessages => [
        ...currentMessages,
        {
          id: generateRandomId(),
          threadId: thread.id,
          body: state.inputValue,
          createdAt: String(Date.now()),
          sending: true,
        },
      ])
      addMessage({
        variables,
      })
      setState({ inputValue: '' })
    }
  }

  return (
    <Container className={className} onSubmit={submit}>
      <div className="relative">
        <SendButton type="submit" className="btn btn-text">
          <Icon name="send" />
        </SendButton>
        <TextareaStyled
          name="message"
          className="input"
          placeholder="Enviar mensagem..."
          maxRows={3}
          onKeyDown={handleInputKeyDown}
          onChange={handleInputChange}
          value={state.inputValue}
        />
      </div>
    </Container>
  )
}

export default InboxConversationForm
