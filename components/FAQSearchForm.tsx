import React, { useState } from 'react'
import styled from 'styled-components'
import Icon from './Icon'
import { useRouter } from 'next/router'
import debounce from 'debounce'
import { Page } from '../common'
import { useIntl, defineMessages } from 'react-intl'

const FAQSearchFormStyled = styled.form`
  > .icon {
    right: 20px;
    font-size: 24px;
    bottom: 0;
    top: 0;
    height: 24px;
    line-height: 1;
    display: block;
    margin: auto;
    pointer-events: none;
  }
`

const Input = styled.input`
  height: 60px;
  font-size: 20px;
  padding: 10px 48px 10px 24px;
`

const Hint = styled.span`
  bottom: -24px;
  font-size: 13px;
`

interface FAQSearchFormProps {
  readonly className?: string
  readonly defaultValue?: string
}

interface FAQSearchFormState {
  inputValue: string
  hintEnabled: boolean
}

const m = defineMessages({
  placeholder: {
    id: 'faqSearchForm.placeholder',
    defaultMessage: 'Busque sua dúvida...',
  },
  enter: {
    id: 'faqSearchForm.enter',
    defaultMessage: 'Pressione ENTER para pesquisar',
  },
})

const FAQSearchForm: React.FC<FAQSearchFormProps> = ({
  className,
  defaultValue,
}) => {
  const intl = useIntl()
  const router = useRouter()
  const [state, setState] = useState<FAQSearchFormState>({
    inputValue: defaultValue || '',
    hintEnabled: false,
  })
  const handleQueryChange = debounce((value: string) =>
    router.push(value.length ? `${Page.FAQ}?query=${value}` : Page.FAQ),
  )
  const handelInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    if (router.pathname === Page.FAQ) {
      setState({ inputValue: value, hintEnabled: false })
      handleQueryChange(value)
    } else if (value.trim().length) {
      setState({ inputValue: value, hintEnabled: true })
    } else if (state.hintEnabled) {
      setState({ inputValue: value, hintEnabled: false })
    }
  }
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    handleQueryChange(state.inputValue)
    setState({ inputValue: state.inputValue, hintEnabled: false })
  }

  return (
    <FAQSearchFormStyled
      className={`form-inline relative ${className ? `${className} ` : ''}`}
      onSubmit={handleSubmit}
    >
      <Input
        type="text"
        className="input bg-white rounded-full border-transparent shadow"
        placeholder={intl.formatMessage(m.placeholder)}
        onChange={handelInputChange}
        value={state.inputValue}
      />
      {state.hintEnabled && (
        <Hint className="text-white-alpha-80 animate-slideInUp block mt-2 absolute left-0 right-0">
          {intl.formatMessage(m.enter)}
        </Hint>
      )}
      <Icon
        name="search"
        className="absolute top-0 bottom-0 border-l pl-3 text-gray-700"
      />
    </FAQSearchFormStyled>
  )
}

FAQSearchForm.displayName = 'FAQSearchForm'

export default FAQSearchForm
