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
import { RootState } from '~/base/redux/root-reducer'

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

  return (
    <DropdownWithContext className={className}>
      <hr />
      <DropdownToggler>
        <button className="btn-text p-0 border-0">
          <Icon name="language" className="mr-2" />
          Alterar lingua
          <Icon name="keyboard_arrow_down" className="ml-2 inline-block" />
        </button>
      </DropdownToggler>
      <DropdownMenu>
        <div className="py-2">
          <LanguageDropdownItem locale="pt-br" active={locale === 'pt-br'}>
            {intl.formatMessage(m.portuguese)}
          </LanguageDropdownItem>

          <LanguageDropdownItem locale="en-us" active={locale === 'en-us'}>
            {intl.formatMessage(m.english)}
          </LanguageDropdownItem>

          <LanguageDropdownItem locale="es-ar" active={locale === 'es-ar'}>
            {intl.formatMessage(m.spanish)}
          </LanguageDropdownItem>
        </div>
      </DropdownMenu>
    </DropdownWithContext>
  )
}

LanguageDropdown.displayName = 'LanguageDropdown'

export default LanguageDropdown
