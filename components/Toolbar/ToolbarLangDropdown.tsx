import React from 'react'
import { defineMessages } from 'react-intl'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import Icon from '../Icon'
import ToolbarDropdown from './ToolbarDropdown'

const ToolbarDropdownStyled = styled(ToolbarDropdown)`
  .toolbar-dropdown-anchor {
    border-radius: 9999px !important;
    color: #333 !important;
    font-weight: normal !important;

    &.active {
      border-radius: 6px 6px 0 0 !important;
    }
  }

  .toolbar-dropdown-menu {
    width: 200px;
    height: auto;
  }
`

interface ToolbarLangDropdownProps {
  readonly className?: string
}

const m = defineMessages({
  portuguese: {
    id: 'toolbar.lang.portuguese',
    defaultMessage: 'Português',
  },
})

const ToolbarLangDropdown: React.FC<ToolbarLangDropdownProps> = ({
  className,
}) => {
  const intl = useIntl()

  return (
    <ToolbarDropdownStyled
      href="/vagas"
      className={className}
      anchorClassName="toolbar-dropdown-anchor bg-white"
      menuClassName="toolbar-dropdown-menu"
      title={
        <>
          {intl.formatMessage(m.portuguese)}
          <Icon name="keyboard_arrow_down" className="ml-1" />
        </>
      }
    >
      <div className="p-2">
        <button className="btn btn-text ta-left tw-medium mb-2 btn--block text-truncate tc-primary-500">
          Português
        </button>
        <button className="btn btn-text ta-left tw-normal btn--block text-truncate">
          Espanhol
        </button>
        <button className="btn btn-text ta-left tw-normal mb-2 btn--block text-truncate">
          Inglês
        </button>
        <button className="btn btn-text ta-left tw-normal btn--block text-truncate">
          Português de Portugal
        </button>
      </div>
    </ToolbarDropdownStyled>
  )
}
ToolbarLangDropdown.displayName = 'ToolbarLangDropdown'

export default React.memo(ToolbarLangDropdown)
