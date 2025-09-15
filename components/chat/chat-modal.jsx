"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, ImageIcon, MapPin, Clock } from "lucide-react"

// Mock chat data
const mockMessages = [
  {
    id: 1,
    sender: "other",
    senderName: "Sarah M.",
    message: "Hi! Is the calculus textbook still available?",
    timestamp: "2024-01-15T10:30:00Z",
    type: "text",
  },
  {
    id: 2,
    sender: "me",
    message: "Yes, it's still available! It's in great condition.",
    timestamp: "2024-01-15T10:32:00Z",
    type: "text",
  },
  {
    id: 3,
    sender: "other",
    senderName: "Sarah M.",
    message: "Perfect! Where would be a good place to meet?",
    timestamp: "2024-01-15T10:35:00Z",
    type: "text",
  },
  {
    id: 4,
    sender: "me",
    message: "How about the Student Union lobby? I'm usually there between classes.",
    timestamp: "2024-01-15T10:37:00Z",
    type: "text",
  },
]

const quickReplies = [
  "Is this still available?",
  "What's the condition?",
  "Where can we meet?",
  "Can you do $X?",
  "I'll take it!",
]

const meetupSpots = [
  { name: "Student Union Lobby", icon: "🏢" },
  { name: "Library Main Entrance", icon: "📚" },
  { name: "Campus Coffee Shop", icon: "☕" },
  { name: "Dining Hall", icon: "🍽️" },
  { name: "Gym Entrance", icon: "🏃" },
  { name: "Parking Lot B", icon: "🚗" },
]

export default function ChatModal({ isOpen, onClose, item, otherUser }) {
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [showQuickReplies, setShowQuickReplies] = useState(false)
  const [showMeetupSpots, setShowMeetupSpots] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message = {
      id: messages.length + 1,
      sender: "me",
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: "text",
    }

    setMessages([...messages, message])
    setNewMessage("")
    setShowQuickReplies(false)
  }

  const handleQuickReply = (reply) => {
    setNewMessage(reply)
    setShowQuickReplies(false)
  }

  const handleMeetupSpot = (spot) => {
    const message = {
      id: messages.length + 1,
      sender: "me",
      message: `How about meeting at ${spot.name}? ${spot.icon}`,
      timestamp: new Date().toISOString(),
      type: "text",
    }

    setMessages([...messages, message])
    setShowMeetupSpots(false)
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {otherUser?.name?.charAt(0) || "U"}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{otherUser?.name || "User"}</h3>
              <p className="text-sm text-gray-600">{item?.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Item Preview */}
        <div className="p-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              src={item?.image || "/placeholder.svg"}
              alt={item?.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{item?.title}</h4>
              <p className="text-lg font-semibold text-cyan-600">${item?.price}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.sender === "me" ? "bg-cyan-500 text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">{message.message}</p>
                <p className={`text-xs mt-1 ${message.sender === "me" ? "text-cyan-100" : "text-gray-500"}`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {showQuickReplies && (
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs font-medium text-gray-600 mb-2">Quick replies:</p>
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Meetup Spots */}
        {showMeetupSpots && (
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs font-medium text-gray-600 mb-2">Campus meetup spots:</p>
            <div className="grid grid-cols-2 gap-2">
              {meetupSpots.map((spot, index) => (
                <button
                  key={index}
                  onClick={() => handleMeetupSpot(spot)}
                  className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span>{spot.icon}</span>
                  <span className="truncate">{spot.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <button
              onClick={() => setShowQuickReplies(!showQuickReplies)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              title="Quick replies"
            >
              <Clock className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowMeetupSpots(!showMeetupSpots)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              title="Meetup spots"
            >
              <MapPin className="w-4 h-4" />
            </button>
            <button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              title="Send image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
