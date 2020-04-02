import React, { useState } from 'react'
import Layout from '~/components/Layout'
import Meta from '~/components/Meta'
import Notification from '~/components/Notification'

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

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(
    notificationsFake,
  )
  function handleMarkAllAsRead() {
    setNotifications(
      notifications.map(not =>
        not.read === false ? { ...not, read: true } : not,
      ),
    )
  }

  return (
    <Layout disableFooter>
      <Meta title="Notificações" />
      <div>
        <div className="flex items-center justify-between max-w-5xl mx-auto pt-12">
          <h1 className="text-3xl font-bold">Notificações</h1>
          <button
            type="button"
            className="rounded bg-gray-200 px-2 py-1 outline-none hover:bg-gray-300"
            onClick={() => handleMarkAllAsRead()}
          >
            Marcar todas como lidas
          </button>
        </div>

        <div className="mx-auto max-w-5xl">
          {notifications.map(notification => (
            <Notification
              notification={notification}
              className="rounded-md mb-4 "
            />
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default NotificationsPage
