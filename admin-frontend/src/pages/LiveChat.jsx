import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../api/chatService';
import './LiveChat.css';

const LiveChat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const selectedChatRef = useRef(null);

  // Keep selectedChat in ref for polling
  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  // Initial load
  useEffect(() => {
    loadChats();
  }, []);

  // Poll for chat list updates every 5 seconds
  useEffect(() => {
    const pollInterval = setInterval(() => {
      loadChats();
    }, 5000);

    return () => clearInterval(pollInterval);
  }, []);

  // Poll for messages when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      loadChatMessages(selectedChat._id);
      
      // Poll for new messages every 3 seconds
      const pollInterval = setInterval(() => {
        loadChatMessages(selectedChat._id);
      }, 3000);

      return () => clearInterval(pollInterval);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChats = async () => {
    try {
      const response = await chatService.getAllChats();
      setChats(response.data || []);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChatMessages = async (chatId) => {
    try {
      const response = await chatService.getChatById(chatId);
      const newMessages = response.data.messages || [];
      
      // Only update if messages changed to avoid unnecessary re-renders
      if (JSON.stringify(newMessages) !== JSON.stringify(messages)) {
        setMessages(newMessages);
        setTimeout(() => scrollToBottom(), 100);
      }
      
      await chatService.markAsRead(chatId);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    try {
      setSending(true);
      
      // Send via API (which will trigger socket events)
      const response = await chatService.sendMessage(selectedChat._id, message.trim());
      
      // Update local messages immediately
      if (response.data && response.data.messages) {
        setMessages(response.data.messages);
      }
      
      setMessage('');
      
      // Refresh chat list
      loadChats();
      
      // Scroll to bottom
      setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedChat) return;

    try {
      setSending(true);
      const response = await chatService.sendMessage(selectedChat._id, '', file);
      setMessages(response.data.messages || []);
      loadChats();
    } catch (error) {
      console.error('Error sending image:', error);
      alert('Failed to send image');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date) => {
    const today = new Date();
    const msgDate = new Date(date);
    
    if (msgDate.toDateString() === today.toDateString()) {
      return formatTime(date);
    }
    
    return msgDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  };

  if (loading) {
    return (
      <div className="live-chat-container">
        <div className="loading">Loading chats...</div>
      </div>
    );
  }

  return (
    <div className="live-chat-container">
      {/* Chat List */}
      <div className="chat-list">
        <div className="chat-list-header">
          <h2>Live Chat</h2>
          <span className="chat-count">{chats.length} conversations</span>
        </div>

        <div className="chat-list-items">
          {chats.length === 0 ? (
            <div className="empty-state">
              <p>No active chats</p>
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat._id}
                className={`chat-item ${selectedChat?._id === chat._id ? 'active' : ''}`}
                onClick={() => setSelectedChat(chat)}
              >
                <img
                  src={chat.user.profileImage || `https://via.placeholder.com/50/704F38/FFFFFF?text=${chat.user.name?.charAt(0) || 'U'}`}
                  alt={chat.user.name}
                  className="chat-avatar"
                />
                <div className="chat-info">
                  <div className="chat-header-row">
                    <h4>{chat.user.name}</h4>
                    <span className="chat-time">{formatDate(chat.lastMessageAt)}</span>
                  </div>
                  <p className="chat-last-message">{chat.lastMessage || 'No messages yet'}</p>
                </div>
                {chat.unreadCount > 0 && (
                  <span className="unread-badge">{chat.unreadCount}</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="chat-window">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="chat-window-header">
              <img
                src={selectedChat.user.profileImage || `https://via.placeholder.com/40/704F38/FFFFFF?text=${selectedChat.user.name?.charAt(0) || 'U'}`}
                alt={selectedChat.user.name}
                className="chat-window-avatar"
              />
              <div className="chat-window-info">
                <h3>{selectedChat.user.name}</h3>
                <p>{selectedChat.user.email}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="messages-container">
              <div className="date-divider">
                <span>TODAY</span>
              </div>

              {messages.map((msg, index) => {
                const isAdmin = msg.senderRole === 'super_admin';
                return (
                  <div
                    key={index}
                    className={`message ${isAdmin ? 'message-sent' : 'message-received'}`}
                  >
                    {!isAdmin && (
                      <img
                        src={msg.sender.profileImage || `https://via.placeholder.com/32/704F38/FFFFFF?text=${msg.sender.name?.charAt(0) || 'U'}`}
                        alt={msg.sender.name}
                        className="message-avatar"
                      />
                    )}
                    <div className="message-content">
                      {!isAdmin && <div className="message-sender">{msg.sender.name}</div>}
                      {msg.image && (
                        <img src={msg.image} alt="Sent image" className="message-image" />
                      )}
                      {msg.message && <div className="message-text">{msg.message}</div>}
                      <div className="message-time">{formatTime(msg.createdAt)}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form className="chat-input-container" onSubmit={handleSendMessage}>
              <label htmlFor="image-upload" className="add-button">
                <i className="fas fa-plus"></i>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>

              <input
                type="text"
                className="chat-input"
                placeholder="Type a message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={sending}
              />

              <button
                type="submit"
                className="send-button"
                disabled={!message.trim() || sending}
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <i className="fas fa-comments"></i>
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveChat;
