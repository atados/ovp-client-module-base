import React from 'react'
import cookie from 'js-cookie'
import Icon from '../Icon'

interface LanguageDropdownItemProps {
  readonly locale: string
  readonly active?: boolean
}

const LanguageDropdownItem: React.FC<LanguageDropdownItemProps> = ({
  active,
  locale,
  children,
}) => {
  const handleClick = () => {
    cookie.set('locale', locale)
    location.reload()
  }

  return (
    <button
      className={`btn btn--block ta-left ${
        active ? 'tc-primary-500 tw-medium' : 'hover:bg-gray-200'
      } rounded-b-lg`}
      onClick={handleClick}
    >
      <Icon
        name={active ? 'check_circle' : 'check_circle_outline'}
        className="mr-2"
      />
      {children}
    </button>
  )
}

LanguageDropdownItem.displayName = 'LanguageDropdownItem'

export default LanguageDropdownItem
