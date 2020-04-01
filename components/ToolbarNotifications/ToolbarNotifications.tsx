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

const notificationsFake = [
  {
    id: 1,
    read: true,
    type: 'Confirm',
    project: 'Nome da Vaga',
    org: 'Nome da ONG',
    image: {
      image_medium_url:
        'https://storage.googleapis.com/atados-v3/user-uploaded/images-medium/e7b7bce0-e287-4ef3-a3f7-d8904097e4af.jpeg',
    },
    created_at: 'Agora',
  },
  {
    id: 2,
    read: false,
    type: 'Delete',
    project: 'Nome da Vaga',
    org: 'Nome da ONG',
    image: {
      image_medium_url:
        'https://storage.googleapis.com/atados-v3/user-uploaded/images-medium/e7b7bce0-e287-4ef3-a3f7-d8904097e4af.jpeg',
    },
    created_at: 'Agora',
  },
  {
    id: 3,
    read: false,
    type: 'Alert',
    project: 'Nome da Vaga',
    org: 'Nome da ONG',
    image: {
      image_medium_url:
        'https://storage.googleapis.com/atados-v3/user-uploaded/images-medium/e7b7bce0-e287-4ef3-a3f7-d8904097e4af.jpeg',
    },
    created_at: 'Agora',
  },
  {
    id: 4,
    read: true,
    type: 'Warn',
    project: 'Nome da Vaga',
    org: 'Nome da ONG',
    image: {
      image_medium_url:
        'https://storage.googleapis.com/atados-v3/user-uploaded/images-medium/e7b7bce0-e287-4ef3-a3f7-d8904097e4af.jpeg',
    },
    created_at: 'Agora',
  },
]

const ToolbarNotifications: React.FC<ToolbarNotificationsProps> = ({
  theme,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>(
    notificationsFake,
  )
  const [open, setOpen] = useState(false)
  const newNotificationsCount = notifications?.filter(
    item => item.read === false,
  ).length

  function handleMarkAsRead(id) {
    setNotifications(
      notifications?.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    )
  }

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
        {open && (
          <ViewerNotifications
            notifications={notifications}
            handleMarkAsRead={handleMarkAsRead}
          />
        )}
      </Menu>
    </DropdownWithContext>
  )
}

ToolbarNotifications.displayName = 'ToolbarNotifications'

export default ToolbarNotifications
