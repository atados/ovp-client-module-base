import React from 'react'
import { defineMessages } from 'react-intl'
import { useIntl } from 'react-intl'
import ToolbarDropdown from './ToolbarDropdown'
import Icon from '../Icon'
import { Page } from '~/base/common'

interface VolunteerDropdownProps {
  readonly className?: string
}

const m = defineMessages({
  volunteer: {
    id: 'toolbar.volunteer',
    defaultMessage: 'Seja voluntário',
  },
})

const VolunteerDropdown: React.FC<VolunteerDropdownProps> = ({ className }) => {
  const intl = useIntl()

  return (
    <ToolbarDropdown
      href={Page.SearchProjects}
      className={className}
      title={
        <>
          {intl.formatMessage(m.volunteer)} <Icon name="keyboard_arrow_down" />
        </>
      }
    >
      <div className="p-4">
        <a href="/" className="block tc-base rounded-lg p-2 bg-muted">
          <b className="block">Vagas de voluntariado</b>
          <span className="block tc-muted ts-small">
            Veja vagas de voluntariado perto de você. Você pode usar nossos
            filtros para encontrar a vaga que mais de encaixa com você.
          </span>
        </a>
      </div>
    </ToolbarDropdown>
  )
}
VolunteerDropdown.displayName = 'VolunteerDropdown'

export default React.memo(VolunteerDropdown)
