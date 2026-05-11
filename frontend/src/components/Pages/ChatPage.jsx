import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Send, User, ChevronLeft, Search, Phone, Video, MoreVertical } from 'lucide-react'
import api from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import io from 'socket.io-client'

export default function ChatPage() {
  const { userId } = useParams()
  const { user: currentUser } = useAuth()
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const socketRef = useRef()
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Initialize socket
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
    socketRef.current = io(backendUrl)

    fetchConversations()

    return () => {
      if (socketRef.current) socketRef.current.disconnect()
    }
  }, [])

  useEffect(() => {
    if (userId) {
      fetchMessages(userId)
    }
  }, [userId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchConversations = async () => {
    try {
      const response = await api.get('/api/chat/conversations')
      if (response.data.success) {
        setConversations(response.data.conversations)
      }
    } catch (error) {
      console.error('Fetch conversations error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (id) => {
    try {
      const response = await api.get(`/api/chat/conversation/${id}`)
      if (response.data.success) {
        setMessages(response.data.messages)
        
        // Find selected user info from conversations
        const contact = conversations.find(c => c._id === id)
        if (contact) setSelectedUser(contact)
        else {
          // If not in list, fetch basic user info (or it will be populated in messages)
          if (response.data.messages.length > 0) {
            const firstMsg = response.data.messages[0]
            setSelectedUser(firstMsg.sender._id === id ? firstMsg.sender : firstMsg.receiver)
          }
        }
      }
    } catch (error) {
      console.error('Fetch messages error:', error)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !userId) return

    try {
      const response = await api.post('/api/chat/send', {
        receiverId: userId,
        message: newMessage
      })

      if (response.data.success) {
        setMessages([...messages, response.data.chatMessage])
        setNewMessage('')
        fetchConversations() // Update list
      }
    } catch (error) {
      console.error('Send message error:', error)
    }
  }

  return (
    <div style={{ height: 'calc(100vh - 40px)', display: 'grid', gridTemplateColumns: '350px 1fr', background: '#fff', borderRadius: '24px', overflow: 'hidden', border: '1px solid #e2e8f0', margin: '20px' }}>
      
      {/* Sidebar: Conversations List */}
      <div style={{ borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a2e', marginBottom: '16px' }}>Messages</h2>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search chats..."
              style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', background: '#f8fafc' }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.length > 0 ? conversations.map(conv => (
            <Link 
              key={conv._id} 
              to={`/chat/${conv._id}`}
              style={{ 
                display: 'flex', gap: '12px', padding: '16px 24px', textDecoration: 'none',
                background: userId === conv._id ? '#f0f6ff' : 'transparent',
                borderLeft: userId === conv._id ? '4px solid #1a73e8' : '4px solid transparent',
                transition: 'background 0.2s'
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e2e8f0', flexShrink: 0, overflow: 'hidden' }}>
                <img src={conv.avatar || `https://i.pravatar.cc/150?u=${conv._id}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '15px' }}>{conv.firstName} {conv.lastName}</span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {conv.lastMessage ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '13px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                    {conv.lastMessage?.message || 'No messages yet'}
                  </p>
                  {conv.unreadCount > 0 && (
                    <span style={{ background: '#1a73e8', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '2px 6px', borderRadius: '100px' }}>
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          )) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No conversations yet</div>
          )}
        </div>
      </div>

      {/* Main: Chat Window */}
      <div style={{ display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div style={{ padding: '16px 24px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0', overflow: 'hidden' }}>
                  <img src={selectedUser.avatar || `https://i.pravatar.cc/150?u=${selectedUser._id}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', color: '#1a1a2e' }}>{selectedUser.firstName} {selectedUser.lastName}</div>
                  <div style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></span> Online
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', color: '#64748b' }}>
                <Phone size={20} style={{ cursor: 'pointer' }} />
                <Video size={20} style={{ cursor: 'pointer' }} />
                <MoreVertical size={20} style={{ cursor: 'pointer' }} />
              </div>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {messages.map((msg, index) => {
                const isMine = msg.sender._id === currentUser?._id || msg.sender === currentUser?._id
                return (
                  <div key={msg._id || index} style={{ 
                    alignSelf: isMine ? 'flex-end' : 'flex-start',
                    maxWidth: '70%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMine ? 'flex-end' : 'flex-start'
                  }}>
                    <div style={{ 
                      padding: '12px 16px',
                      borderRadius: isMine ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                      background: isMine ? '#1a73e8' : '#fff',
                      color: isMine ? '#fff' : '#1a1a2e',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      fontSize: '14px',
                      lineHeight: '1.5'
                    }}>
                      {msg.message}
                    </div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div style={{ padding: '24px', background: '#fff', borderTop: '1px solid #e2e8f0' }}>
              <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px' }}>
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  style={{ flex: 1, padding: '14px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none' }}
                />
                <button type="submit" style={{ background: '#1a73e8', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
                  <Send size={18} /> Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
              <Send size={32} color="#1a73e8" />
            </div>
            <h3 style={{ color: '#1a1a2e', marginBottom: '8px' }}>Select a conversation</h3>
            <p>Choose a contact from the left to start chatting</p>
          </div>
        )}
      </div>
    </div>
  )
}
