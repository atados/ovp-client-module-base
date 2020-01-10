import React from 'react'
import Icon from '~/components/Icon'
import {
  DropdownWithContext,
  DropdownToggler,
  DropdownMenu,
} from '~/components/Dropdown'
import { defineMessages, useIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import LanguageDropdownItem from './LanguageDropdownItem'
import { RootState } from '~/redux/root-reducer'

interface LanguageDropdownProps {
  readonly className?: string
}

const m = defineMessages({
  english: {
    id: 'languageDropdown.english',
    defaultMessage: 'English',
  },

  portuguese: {
    id: 'languageDropdown.portuguese',
    defaultMessage: 'Português',
  },

  spanish: {
    id: 'languageDropdown.spanish',
    defaultMessage: 'Espanhol',
  },
})

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ className }) => {
  const intl = useIntl()
  const locale = useSelector((state: RootState) => state.intl.locale)
  const messages = {
    'pt-br': intl.formatMessage(m.portuguese),
    'en-us': intl.formatMessage(m.english),
    'es-ar': intl.formatMessage(m.spanish),
  }

  return (
    <DropdownWithContext className={className}>
      <hr />
      <DropdownToggler>
        <button className="btn font-normal text-sm bg-none py-2 border-gray-500 cursor-pointer btn--block text-left rounded">
          <Icon name="language" className="mr-2" />
          {messages[locale]}
          <Icon name="keyboard_arrow_down" className="ml-2 inline-block" />
        </button>
      </DropdownToggler>
      <DropdownMenu>
        <div className="py-3">
          <LanguageDropdownItem locale="pt-br" active={locale === 'pt-br'}>
            {messages['pt-br']}
          </LanguageDropdownItem>

          <LanguageDropdownItem locale="en-us" active={locale === 'en-us'}>
            {messages['en-us']}
          </LanguageDropdownItem>

          <LanguageDropdownItem locale="es-ar" active={locale === 'es-ar'}>
            {messages['es-ar']}
          </LanguageDropdownItem>
        </div>
      </DropdownMenu>
    </DropdownWithContext>
  )
}

LanguageDropdown.displayName = 'LanguageDropdown'

export default LanguageDropdown
