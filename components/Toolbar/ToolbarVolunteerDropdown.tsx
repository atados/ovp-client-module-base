import React from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'
import { useIntl } from 'react-intl'
import ToolbarDropdown from './ToolbarDropdown'
import Icon from '../Icon'
import { Page, Color } from '~/common'
import PageLink from '../PageLink'
import VolunteerIcon from '../Icon/VolunteerIcon'
import styled from 'styled-components'

const ToolbarDropdownStyled = styled(ToolbarDropdown)`
  .dropdown-menu {
    height: auto;
  }
`

const Anchor = styled.a`
  > .icon,
  > svg {
    width: 24px;
    margin-right: 10px;
    display: inline-block;
    text-align: center;
    font-size: 18px;
  }
`

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
    <ToolbarDropdownStyled
      href={Page.SearchProjects}
      className={className}
      title={
        <>
          {intl.formatMessage(m.volunteer)} <Icon name="keyboard_arrow_down" />
        </>
      }
    >
      <div className="p-4">
        <PageLink href="SearchProjects" passHref>
          <Anchor className="block text-gray-800 rounded-lg px-3 py-2 leading-loose h-12 bg-primary-100 hover:bg-primary-200 mb-2 font-medium">
            <VolunteerIcon
              fill={Color.primary[500]}
              className="align-middle icon"
              width={20}
              height={20}
            />
            <FormattedMessage
              id="toolbarVolunteerDropdown.findProjects"
              defaultMessage="Encontre vagas de voluntariado"
            />
          </Anchor>
        </PageLink>

        <PageLink href="SearchOrganizations" passHref>
          <Anchor className="block text-gray-800 rounded-lg px-3 py-2 h-12 leading-loose bg-secondary-100 hover:bg-secondary-200 font-medium">
            <Icon name="explore" className="text-secondary-600" />
            <FormattedMessage
              id="toolbarVolunteerDropdown.findOrganizations"
              defaultMessage="Encontre ONGs"
            />
          </Anchor>
        </PageLink>
      </div>
    </ToolbarDropdownStyled>
  )
}
VolunteerDropdown.displayName = 'VolunteerDropdown'

export default React.memo(VolunteerDropdown)
