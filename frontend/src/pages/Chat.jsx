import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Chat = () => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
      newSocket.emit('register', user._id);
    });

    newSocket.on('receiveMessage', (message) => {
      if (selectedContact && 
          (message.senderId._id === selectedContact._id || 
           message.receiverId._id === selectedContact._id)) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => newSocket.close();
  }, [user, selectedContact]);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages(selectedContact._id);
    }
  }, [selectedContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchContacts = async () => {
    try {
      const response = await api.get('/chat/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const fetchMessages = async (contactId) => {
    try {
      const response = await api.get(`/chat/messages/${contactId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    try {
      const messageData = {
        receiverId: selectedContact._id,
        message: newMessage
      };

      const response = await api.post('/chat/send', messageData);
      
      if (socket) {
        socket.emit('sendMessage', {
          ...response.data,
          senderId: user
        });
      }

      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <h2>Messages</h2>
        <div className="contacts-list">
          {contacts.map((contact) => (
            <div
              key={contact._id}
              className={`contact ${selectedContact?._id === contact._id ? 'active' : ''}`}
              onClick={() => setSelectedContact(contact)}
            >
              <div className="contact-avatar">
                {contact.name.charAt(0).toUpperCase()}
              </div>
              <div className="contact-info">
                <h4>{contact.name}</h4>
                <p>{contact.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-main">
        {selectedContact ? (
          <>
            <div className="chat-header">
              <h3>{selectedContact.name}</h3>
              <span className="status">Online</span>
            </div>

            <div className="messages-container">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`message ${msg.senderId._id === user._id ? 'sent' : 'received'}`}
                >
                  <div className="message-content">{msg.message}</div>
                  <div className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="message-input-form">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>Select a contact to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
