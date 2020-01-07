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
      className={`btn btn--block text-left ${
        active ? 'text-primary-500 font-medium' : 'hover:bg-gray-200'
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
