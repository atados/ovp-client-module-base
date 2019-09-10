import React from 'react'
import Icon from '~/components/Icon'
import {
  DropdownWithContext,
  DropdownToggler,
  DropdownMenu,
} from '~/components/Dropdown'
import { defineMessages, useIntl } from 'react-intl'
import { RootState } from '../redux/root-reducer'
import { useSelector } from 'react-redux'

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

      {
        // @ts-ignore
        <DropdownMenu className="py-2">
          <button
            className={`btn btn--block ta-left ${
              locale === 'es-ar'
                ? 'tc-primary-500 tw-medium'
                : 'hover:bg-gray-200'
            } rounded-b-lg`}
          >
            <Icon
              name={
                locale === 'es-ar' ? 'check_circle' : 'check_circle_outline'
              }
              className="mr-2"
            />
            {intl.formatMessage(m.spanish)}
          </button>
        </DropdownMenu>
      }
    </DropdownWithContext>
  )
}

LanguageDropdown.displayName = 'LanguageDropdown'

export default LanguageDropdown
