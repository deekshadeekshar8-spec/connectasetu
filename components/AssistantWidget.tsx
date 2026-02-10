
import React, { useState, useRef, useEffect } from 'react';
import { useAuth, appFetch as fetch } from '../App';
import { Role } from '../types';
import { useLocation } from 'react-router-dom';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

const AssistantWidget: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: `Hi ${user?.name}, I'm your connectasetu Assistant. How can I help you today?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMsg: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/assistant/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          role: user?.role,
          currentPage: location.pathname,
          message: text
        })
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant' as const, text: data.reply || "I'm sorry, I'm having trouble connecting to the logic engine right now. Please try again in a moment." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant' as const, text: "I've encountered an error. If your call sync is failing, please check your mobile device connection." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const shortcuts = [
    { label: 'Login Issue', icon: 'fa-key' },
    { label: 'Call Sync', icon: 'fa-phone-flip' },
    { label: 'Excel Help', icon: 'fa-file-excel' },
    { label: 'Access Denied', icon: 'fa-shield-halved' }
  ];

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {isOpen ? (
        <div className="bg-white w-[380px] h-[520px] rounded-2xl shadow-2xl border border-brand-blue-100 flex flex-col overflow-hidden animate-in animate-slide-up">
          {/* Header */}
          <div className="bg-brand-blue-600 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-orange-500 rounded-lg flex items-center justify-center shadow-md">
                <i className="fas fa-sparkles text-xs"></i>
              </div>
              <div>
                <p className="font-bold text-sm">connectasetu Assistant</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Active System</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-md transition-colors">
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] shadow-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-brand-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-brand-blue-50 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-2.5 rounded-2xl rounded-tl-none border border-brand-blue-50 flex gap-1">
                  <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Shortcuts */}
          {messages.length === 1 && (
            <div className="px-4 py-2 grid grid-cols-2 gap-2">
              {shortcuts.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(s.label)}
                  className="bg-white border border-brand-blue-100 hover:border-brand-blue-500 hover:text-brand-blue-600 p-2 rounded-xl text-[10px] font-bold text-slate-500 text-left flex items-center gap-2 transition-all shadow-sm"
                >
                  <i className={`fas ${s.icon} text-brand-orange-500`}></i>
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* Footer Input */}
          <div className="p-4 bg-white border-t border-brand-blue-50">
            <div className="flex items-center gap-2 bg-slate-50 border border-brand-blue-100 rounded-xl px-3 py-1.5 focus-within:ring-1 focus-within:ring-brand-blue-500 transition-all">
              <input 
                type="text" 
                className="bg-transparent border-none outline-none flex-1 text-sm py-1 font-medium placeholder:text-slate-400"
                placeholder="Ask for support or team stats..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="text-brand-blue-600 disabled:text-slate-300 transition-colors"
              >
                <i className="fas fa-paper-plane text-sm"></i>
              </button>
            </div>
            <p className="text-[9px] text-center text-slate-300 mt-2 font-bold uppercase tracking-widest">Powered by connectasetu Intelligence</p>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-brand-orange-500 hover:bg-brand-orange-600 text-white px-6 py-4 rounded-full shadow-2xl shadow-brand-orange-500/30 flex items-center gap-3 group transition-all active:scale-95"
        >
          <div className="relative">
             <i className="fas fa-sparkles text-lg"></i>
             <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full border-2 border-brand-orange-500 animate-ping"></div>
          </div>
          <span className="font-bold text-sm tracking-tight pr-1">Need Help?</span>
        </button>
      )}
    </div>
  );
};

export default AssistantWidget;
