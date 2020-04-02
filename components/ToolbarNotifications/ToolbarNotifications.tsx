import React, { useState } from 'react'
import styled from 'styled-components'
import { User } from '~/redux/ducks/user'
import {
  DropdownMenu,
  DropdownToggler,
  DropdownWithContext,
} from '~/components/Dropdown'
import ViewerNotifications from './ViewerNotifications'
import Icon from '~/components/Icon'

const Menu: React.FC<{ className?: string }> = styled(DropdownMenu)`
  left: auto;
  width: 500px;
  min-height: 500px;
`
interface Notification {
  id: number
  read: boolean
  type: string
  project: string
  org: string
  image: {
    image_medium_url: string
  }
  created_at: string
}

interface ToolbarNotificationsProps {
  readonly className?: string
  readonly viewer: User
  readonly theme?: 'dark' | 'light'
}

export const notificationsFake = [
  {
    id: 1,
    read: false,
    type: 'Confirm',
    project: 'Nome da Vaga',
    org: 'Nome da ONG',
    image: {
      image_medium_url:
        'https://storage.googleapis.com/atados-v3/user-uploaded/images-medium/fa8f3c11-77cc-49b2-b224-e004c337cfe5.apng',
    },
    created_at: 'Sun Sep 01 2019 01:07:24 GMT-0300 (Brasilia Standard Time)',
  },
  {
    id: 2,
    read: true,
    type: 'Delete',
    project: 'Nome da Vaga',
    org: 'Nome da ONG',
    image: {
      image_medium_url:
        'https://storage.googleapis.com/atados-v3/user-uploaded/images-medium/fa8f3c11-77cc-49b2-b224-e004c337cfe5.apng',
    },
    created_at: 'Sat May 04 2019 02:24:50 GMT-0300 (Brasilia Standard Time)',
  },
  {
    id: 3,
    read: false,
    type: 'Alert',
    project: 'Nome da Vaga',
    org: 'Nome da ONG',
    image: {
      image_medium_url:
        'https://storage.googleapis.com/atados-v3/user-uploaded/images-medium/fa8f3c11-77cc-49b2-b224-e004c337cfe5.apng',
    },
    created_at: 'Wed Feb 05 2020 07:37:56 GMT-0300 (Brasilia Standard Time)',
  },
  {
    id: 4,
    read: true,
    type: 'Warn',
    project: 'Nome da Vaga',
    org: 'Nome da ONG',
    image: {
      image_medium_url:
        'https://storage.googleapis.com/atados-v3/user-uploaded/images-medium/fa8f3c11-77cc-49b2-b224-e004c337cfe5.apng',
    },
    created_at: 'Wed Jan 08 2020 04:55:00 GMT-0300 (Brasilia Standard Time)',
  },
]

const ToolbarNotifications: React.FC<ToolbarNotificationsProps> = ({
  theme,
}) => {
  const [notifications] = useState<Notification[]>(notificationsFake)
  const [open, setOpen] = useState(false)
  const newNotificationsCount = notifications?.filter(
    item => item.read === false,
  ).length

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
          <div className="flex justify-center">
            {newNotificationsCount > 0 && (
              <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-white mr-2 text-xs flex items-center justify-center">
                {newNotificationsCount > 9 ? '+9' : newNotificationsCount}
              </div>
            )}
            <Icon
              name={
                newNotificationsCount > 0
                  ? 'notifications_active'
                  : 'notifications'
              }
              className={
                open ? 'text-xl text-primary-500' : 'text-xl text-gray-700'
              }
            />
          </div>
        </button>
      </DropdownToggler>
      <Menu className="mt-1 bg-muted">
        {open && <ViewerNotifications notifications={notifications} />}
      </Menu>
    </DropdownWithContext>
  )
}

ToolbarNotifications.displayName = 'ToolbarNotifications'

export default ToolbarNotifications
