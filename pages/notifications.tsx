import React, { useState } from 'react'
import Layout from '~/components/Layout'
import Meta from '~/components/Meta'
import Notification from '~/components/Notification'
import { notificationsFake } from '~/components/ToolbarNotifications/ToolbarNotifications'
import { API } from '~/types/api'
import Icon from '~/components/Icon'

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<API.Notification[]>(
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
      <div className="mx-auto max-w-5xl pt-12">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Notificações</h1>
          <button
            type="button"
            className="rounded px-3 py-2 font-medium outline-none hover:bg-green-200 hover:text-green-900 underline"
            onClick={() => handleMarkAllAsRead()}
          >
            Marcar todas como lidas
            <Icon name="check" className="ml-1" />
          </button>
        </div>
        {notifications.map(notification => (
          <Notification
            notification={notification}
            className="rounded-lg mb-2"
          />
        ))}
      </div>
    </Layout>
  )
}

export default NotificationsPage
