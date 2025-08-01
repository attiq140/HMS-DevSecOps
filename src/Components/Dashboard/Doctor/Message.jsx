import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiPaperclip, FiMenu, FiX } from 'react-icons/fi';
import { BsEmojiSmile, BsCheck2All } from 'react-icons/bs';
import { IoSend } from 'react-icons/io5';
import { RiMessage2Line } from 'react-icons/ri';
import EmojiPicker from 'emoji-picker-react';

const Message = () => {
  // State for UI controls
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [newChatSearch, setNewChatSearch] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  // Mock data
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'patient',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      lastMessage: 'I have been experiencing headaches since yesterday',
      time: '10:30 AM',
      unread: 2,
      online: true,
      messages: [
        { id: 1, sender: 'patient', text: 'Hello Doctor, I have been experiencing headaches since yesterday', time: '10:25 AM', status: 'seen' },
        { id: 2, sender: 'doctor', text: 'Hello Sarah, can you describe the pain?', time: '10:28 AM', status: 'delivered' },
        { id: 3, sender: 'patient', text: 'It\'s a dull ache on both sides of my head', time: '10:30 AM', status: 'seen' },
      ]
    },
    {
      id: 2,
      name: 'Nurse Williams',
      role: 'nurse',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      lastMessage: 'Patient in room 204 needs attention',
      time: '9:15 AM',
      unread: 0,
      online: false,
      messages: [
        { id: 1, sender: 'nurse', text: 'Dr. Smith, patient in room 204 needs attention', time: '9:15 AM', status: 'seen' },
        { id: 2, sender: 'doctor', text: 'I\'ll be there in 10 minutes', time: '9:18 AM', status: 'delivered' },
      ]
    }
  ]);

  const [activeChat, setActiveChat] = useState(conversations[0]);
  const [users, setUsers] = useState([
    {
      id: 3,
      name: 'Michael Brown',
      role: 'patient',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 4,
      name: 'Admin Office',
      role: 'admin',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
    }
  ]);

  const emojiPickerRef = useRef(null);

  // Check if mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        if (!event.target.closest('.emoji-picker-button')) {
          setShowEmojiPicker(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          conv.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || conv.role.toLowerCase() === activeTab;
    return matchesSearch && matchesTab;
  });

  // Filter users for new chat
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(newChatSearch.toLowerCase()) ||
    user.role.toLowerCase().includes(newChatSearch.toLowerCase())
  );

  // Handle file attachment
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      type: file.type.split('/')[0], // 'image', 'video', 'document', etc.
      preview: file.type.includes('image') ? URL.createObjectURL(file) : null
    }));
    
    setAttachments([...attachments, ...newAttachments]);
  };

  // Remove attachment
  const removeAttachment = (id) => {
    setAttachments(attachments.filter(attachment => attachment.id !== id));
  };

  // Handle emoji selection
  const onEmojiClick = (emojiData) => {
    setNewMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // Send message
  const handleSendMessage = () => {
    if ((newMessage.trim() === '' && attachments.length === 0) || !activeChat) return;
    
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeChat.id) {
        const newMsg = {
          id: conv.messages.length + 1,
          sender: 'doctor',
          text: newMessage,
          attachments: attachments.map(att => ({
            name: att.name,
            type: att.type,
            url: att.preview || 'document-icon.png' // In a real app, this would be the uploaded file URL
          })),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent'
        };
        
        return {
          ...conv,
          messages: [...conv.messages, newMsg],
          lastMessage: attachments.length > 0 ? 'Attachment' : newMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    setActiveChat(updatedConversations.find(c => c.id === activeChat.id));
    setNewMessage('');
    setAttachments([]);
  };

  // Start new chat
  const handleStartNewChat = (user) => {
    const existingConv = conversations.find(conv => conv.name === user.name);
    
    if (existingConv) {
      setActiveChat(existingConv);
      if (isMobile) setShowSidebar(false);
      setShowUserSearch(false);
      return;
    }
    
    const newConversation = {
      id: Date.now(),
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      lastMessage: '',
      time: 'Just now',
      unread: 0,
      online: true,
      messages: []
    };
    
    setConversations([newConversation, ...conversations]);
    setActiveChat(newConversation);
    setShowUserSearch(false);
    setNewChatSearch('');
    if (isMobile) setShowSidebar(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Mobile header */}
      {isMobile && !showSidebar && (
        <div className="bg-white p-4 border-b border-gray-200 flex items-center">
          <button 
            onClick={() => setShowSidebar(true)}
            className="mr-4 text-gray-600"
          >
            <FiMenu size={24} />
          </button>
          {activeChat && (
            <div className="flex items-center">
              <img
                src={activeChat.avatar}
                alt={activeChat.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="ml-3">
                <h3 className="font-medium text-gray-900">{activeChat.name}</h3>
                <p className="text-xs text-gray-500">
                  {activeChat.online ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Conversations List */}
        {showSidebar && (
          <div className={`${isMobile ? 'fixed inset-0 z-50 bg-white' : 'w-full'} md:w-80 border-r border-gray-200 bg-white flex flex-col`}>
            {isMobile && (
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
                <button 
                  onClick={() => setShowSidebar(false)}
                  className="text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>
            )}
            
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
                <button 
                  onClick={() => setShowUserSearch(true)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  New Chat
                </button>
              </div>
              
              {showUserSearch ? (
                <div className="relative mb-3">
                  <input
                    type="text"
                    placeholder="Search users to chat with..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newChatSearch}
                    onChange={(e) => setNewChatSearch(e.target.value)}
                    autoFocus
                  />
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  <button
                    onClick={() => {
                      setShowUserSearch(false);
                      setNewChatSearch('');
                    }}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
              )}
              
              <div className="flex mt-3 space-x-2 overflow-x-auto pb-2">
                {!showUserSearch && ['all', 'patient', 'nurse', 'admin'].map((tab) => (
                  <button
                    key={tab}
                    className={`px-3 py-1 text-sm rounded-full capitalize whitespace-nowrap ${activeTab === tab ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'all' ? 'All' : tab + 's'}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {showUserSearch ? (
                <div>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleStartNewChat(user)}
                      >
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="ml-3">
                          <h3 className="font-medium text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No users found
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {filteredConversations.length > 0 ? (
                    filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${activeChat?.id === conversation.id ? 'bg-blue-50' : ''}`}
                        onClick={() => {
                          setActiveChat(conversation);
                          if (isMobile) setShowSidebar(false);
                        }}
                      >
                        <div className="relative">
                          <img
                            src={conversation.avatar}
                            alt={conversation.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {conversation.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{conversation.time}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                            {conversation.unread > 0 && (
                              <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                                {conversation.unread}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 capitalize">{conversation.role}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No conversations found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Main Chat Window */}
        <div className={`flex-1 flex flex-col bg-white ${!activeChat ? 'items-center justify-center' : ''}`}>
          {activeChat ? (
            <>
              {!isMobile && (
                <div className="p-4 border-b border-gray-200 flex items-center">
                  <div className="relative">
                    <img
                      src={activeChat.avatar}
                      alt={activeChat.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {activeChat.online && (
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">{activeChat.name}</h3>
                    <p className="text-xs text-gray-500 capitalize">
                      {activeChat.role} • {activeChat.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {activeChat.messages.length > 0 ? (
                  activeChat.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex mb-4 ${message.sender !== 'doctor' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md rounded-lg p-3 ${message.sender !== 'doctor' ? 'bg-white border border-gray-200' : 'bg-blue-100'}`}
                      >
                        {message.text && <p className="text-gray-800 break-words">{message.text}</p>}
                        
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.attachments.map((attachment, idx) => (
                              <div key={idx} className="relative">
                                {attachment.type === 'image' ? (
                                  <img 
                                    src={attachment.url} 
                                    alt={attachment.name}
                                    className="max-h-60 rounded-md object-cover"
                                  />
                                ) : (
                                  <div className="flex items-center p-3 bg-gray-100 rounded-md">
                                    <FiPaperclip className="mr-2 text-gray-500" />
                                    <span className="text-sm text-gray-700 truncate">{attachment.name}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex justify-end items-center mt-1 space-x-1">
                          <span className="text-xs text-gray-500">{message.time}</span>
                          {message.sender === 'doctor' && (
                            <BsCheck2All
                              className={`text-xs ${message.status === 'seen' ? 'text-blue-500' : 'text-gray-400'}`}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <RiMessage2Line className="text-4xl mb-2" />
                    <p>No messages yet</p>
                    <p className="text-sm mt-1">Start a new conversation with {activeChat.name}</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-200">
                {/* Attachments preview */}
                {attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {attachments.map(attachment => (
                      <div key={attachment.id} className="relative">
                        {attachment.preview ? (
                          <>
                            <img
                              src={attachment.preview}
                              alt={attachment.name}
                              className="h-16 w-16 object-cover rounded-md"
                            />
                            <button
                              onClick={() => removeAttachment(attachment.id)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                            >
                              <FiX size={12} />
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center p-2 bg-gray-100 rounded-md">
                            <FiPaperclip className="mr-2 text-gray-500" />
                            <span className="text-sm text-gray-700 truncate max-w-xs">{attachment.name}</span>
                            <button
                              onClick={() => removeAttachment(attachment.id)}
                              className="ml-2 text-gray-500 hover:text-gray-700"
                            >
                              <FiX size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center relative">
                  <button 
                    className="p-2 text-gray-500 hover:text-gray-700"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <FiPaperclip />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      multiple
                    />
                  </button>
                  
                  <button 
                    className="p-2 text-gray-500 hover:text-gray-700 emoji-picker-button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <BsEmojiSmile />
                  </button>
                  
                  {showEmojiPicker && (
                    <div ref={emojiPickerRef} className="absolute bottom-12 left-12 z-10">
                      <EmojiPicker 
                        onEmojiClick={onEmojiClick}
                        width={300}
                        height={400}
                      />
                    </div>
                  )}
                  
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 mx-2 py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
                    onClick={handleSendMessage}
                    disabled={newMessage.trim() === '' && attachments.length === 0}
                  >
                    <IoSend />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-4">
              <RiMessage2Line className="text-5xl mb-4" />
              <p className="text-xl text-center">Select a conversation to start chatting</p>
              {isMobile && (
                <button
                  onClick={() => setShowSidebar(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Browse Conversations
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;