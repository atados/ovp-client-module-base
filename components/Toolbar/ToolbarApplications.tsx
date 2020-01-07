import React, { useState } from 'react'
import styled from 'styled-components'
import { channel } from '~/common/constants'
import { User } from '~/redux/ducks/user'
import { DropdownMenu, DropdownToggler, DropdownWithContext } from '../Dropdown'
import VolunteerIcon from '../Icon/VolunteerIcon'
import ViewerApplications from '~/components/ViewerApplications'
import { Color } from '~/base/common'

const Menu: React.FC<{ className?: string }> = styled(DropdownMenu)`
  left: auto;
  width: 500px;
  min-height: 500px;
`

interface ToolbarApplicationsProps {
  readonly className?: string
  readonly viewer: User
  readonly theme?: 'dark' | 'light'
}

const ToolbarApplications: React.FC<ToolbarApplicationsProps> = ({ theme }) => {
  const [open, setOpen] = useState(false)

  return (
    <DropdownWithContext onOpenStateChange={setOpen}>
      <DropdownToggler>
        <button
          className={`rounded-full w-10 h-10 no-border mr-2 ${
            open
              ? // if open
                theme === 'light'
                ? 'bg-primary-500'
                : 'bg-white text-white'
              : theme === 'light'
              ? // else if closed
                'bg-black-alpha:10'
              : 'bg-white'
          } btn`}
        >
          <VolunteerIcon
            width={15}
            height={20}
            fill={
              theme === 'light'
                ? open
                  ? '#fff'
                  : '#333'
                : open
                ? channel.theme.color.primary[500]
                : Color.gray[700]
            }
          />
        </button>
      </DropdownToggler>
      <Menu className="mt-1 bg-muted">{open && <ViewerApplications />}</Menu>
    </DropdownWithContext>
  )
}

ToolbarApplications.displayName = 'ToolbarApplications'

export default ToolbarApplications
