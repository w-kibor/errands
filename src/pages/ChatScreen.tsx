import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Phone } from 'lucide-react';
import { mockMessages, mockRider } from '../data/mockData';
import { Message } from '../types';
export const ChatScreen = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'u1',
      text: input,
      timestamp: new Date().toISOString(),
      isRider: false
    };
    setMessages([...messages, newMessage]);
    setInput('');
    // Simulate reply
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        senderId: 'r1',
        text: 'Okay, noted.',
        timestamp: new Date().toISOString(),
        isRider: true
      };
      setMessages((prev) => [...prev, reply]);
    }, 2000);
  };
  const quickReplies = ["I'm at the gate", 'Please call me', 'Leave at door'];
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 20
      }}
      animate={{
        opacity: 1,
        x: 0
      }}
      exit={{
        opacity: 0,
        x: -20
      }}
      className="flex flex-col h-full bg-gray-50">
      
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-4 shadow-sm flex items-center justify-between z-10">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 mr-2 bg-gray-50 rounded-full">
            
            <ArrowLeft size={20} className="text-dark" />
          </button>
          <div className="flex items-center">
            <div className="relative">
              <img
                src={mockRider.avatar}
                alt="Rider"
                className="w-10 h-10 rounded-full object-cover" />
              
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="ml-3">
              <h2 className="font-bold text-dark text-sm">{mockRider.name}</h2>
              <p className="text-xs text-gray-500">Bajaj Boxer 150</p>
            </div>
          </div>
        </div>
        <button className="p-2 bg-green-50 text-green-600 rounded-full">
          <Phone size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        <div className="text-center my-4">
          <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Today
          </span>
        </div>

        {messages.map((msg) => {
          const time = new Date(msg.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          });
          return (
            <div
              key={msg.id}
              className={`flex ${msg.isRider ? 'justify-start' : 'justify-end'}`}>
              
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${msg.isRider ? 'bg-white border border-gray-100 text-dark rounded-tl-sm shadow-sm' : 'bg-brand text-dark rounded-tr-sm shadow-sm'}`}>
                
                <p className="text-sm">{msg.text}</p>
                <p
                  className={`text-[10px] mt-1 text-right ${msg.isRider ? 'text-gray-400' : 'text-dark/60'}`}>
                  
                  {time}
                </p>
              </div>
            </div>);

        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-100 p-4 pb-safe">
        {/* Quick Replies */}
        <div className="flex space-x-2 mb-3 overflow-x-auto no-scrollbar pb-1">
          {quickReplies.map((reply) =>
          <button
            key={reply}
            onClick={() => setInput(reply)}
            className="whitespace-nowrap bg-gray-50 border border-gray-200 text-dark text-xs font-medium px-3 py-1.5 rounded-full hover:bg-gray-100">
            
              {reply}
            </button>
          )}
        </div>

        <form onSubmit={handleSend} className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-sm outline-none focus:border-brand focus:bg-white transition-colors" />
          
          <button
            type="submit"
            disabled={!input.trim()}
            className={`ml-3 w-12 h-12 rounded-full flex items-center justify-center transition-colors ${input.trim() ? 'bg-brand text-dark' : 'bg-gray-100 text-gray-400'}`}>
            
            <Send size={20} className={input.trim() ? 'ml-1' : ''} />
          </button>
        </form>
      </div>
    </motion.div>);

};