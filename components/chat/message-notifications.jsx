"use client"

import { useState } from "react"
import { X, MessageCircle } from "lucide-react"

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    type: "message",
    sender: "Sarah M.",
    message: "Hi! Is the calculus textbook still available?",
    item: "Calculus Textbook",
    timestamp: "2024-01-15T10:30:00Z",
    read: false,
  },
  {
    id: 2,
    type: "payment",
    message: "Payment received for MacBook Air M2",
    amount: 950,
    currency: "USDC",
    timestamp: "2024-01-14T14:20:00Z",
    read: false,
  },
  {
    id: 3,
    type: "message",
    sender: "Mike R.",
    message: "Thanks for the quick delivery!",
    item: "iPhone 13 Pro",
    timestamp: "2024-01-13T09:15:00Z",
    read: true,
  },
]

export default function MessageNotifications() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [showNotifications, setShowNotifications] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const formatTime = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now - time) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
      >
        <MessageCircle className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
                  Mark all read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {notification.type === "message" ? (
                        <div>
                          <p className="font-medium text-gray-900">{notification.sender}</p>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">Re: {notification.item}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium text-gray-900">Payment Received</p>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-sm font-semibold text-green-600 mt-1">
                            +{notification.amount} {notification.currency}
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-2">{formatTime(notification.timestamp)}</p>
                    </div>

                    <div className="flex items-center space-x-2 ml-3">
                      {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeNotification(notification.id)
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <button className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">View all messages</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
