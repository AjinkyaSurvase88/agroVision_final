/**
 * Chatbot.jsx — AgroVision AI Assistant
 * Scrollable chat UI with user/bot bubbles, typing indicator,
 * suggested questions, and markdown-lite bold rendering.
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sendMessage } from '../services/chatbotApi';
import { useTranslation } from '../context/LanguageContext';

// ── Render **bold** text ───────────────────────────────────────────
const renderMarkdown = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i} className="font-semibold">{p.slice(2, -2)}</strong>
      : p
  );
};

// ── Message bubble ─────────────────────────────────────────────────
const Bubble = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex items-end gap-2 bubble-enter ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-forest-600 flex items-center justify-center flex-shrink-0 mb-0.5">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6 2 3 8 3 12c0 4.5 3 8 9 8s9-3.5 9-8c0-4-3-8-9-8z" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.2"/>
            <path d="M12 20V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
      )}
      <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm font-sans leading-relaxed
        ${isUser
          ? 'bg-forest-600 text-white rounded-br-sm'
          : 'bg-white border border-forest-100 text-gray-700 rounded-bl-sm shadow-sm'}`}
      >
        {renderMarkdown(msg.content)}
        <p className={`text-[10px] mt-1.5 ${isUser ? 'text-white/60' : 'text-gray-400'}`}>
          {msg.time}
        </p>
      </div>
    </div>
  );
};

// ── Typing indicator ───────────────────────────────────────────────
const TypingIndicator = () => (
  <div className="flex items-end gap-2 bubble-enter">
    <div className="w-7 h-7 rounded-full bg-forest-600 flex items-center justify-center flex-shrink-0">
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6 2 3 8 3 12c0 4.5 3 8 9 8s9-3.5 9-8c0-4-3-8-9-8z" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.2"/>
      </svg>
    </div>
    <div className="bg-white border border-forest-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
      {[0,1,2].map(i => (
        <span key={i} className="w-1.5 h-1.5 rounded-full bg-forest-400 animate-bounce" style={{ animationDelay: `${i*150}ms` }} />
      ))}
    </div>
  </div>
);

const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const Chatbot = ({ compact = false }) => {
  const { t } = useTranslation();
  
  const SUGGESTIONS = [
    t('chat.suggestion1'),
    t('chat.suggestion2'),
    t('chat.suggestion3'),
    t('chat.suggestion4'),
    t('chat.suggestion5'),
  ];

  const WELCOME = {
    role: 'bot',
    content: t('chat.hello'),
    time: nowTime(),
  };

  const [messages, setMessages] = useState([WELCOME]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showSugg, setShowSugg] = useState(true);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
  const container = bottomRef.current?.parentElement;
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}, [messages, loading]);

  const send = useCallback(async (text) => {
    const q = text.trim();
    if (!q || loading) return;

    setShowSugg(false);
    setInput('');

    const userMsg = { role: 'user', content: q, time: nowTime() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // Filter history to exclude welcome message
      const history = messages
        .filter(m => !(m.role === 'bot' && m.content === WELCOME.content))
        .map(m => ({ role: m.role, content: m.content }));
      
      const reply = await sendMessage(q, history);
      setMessages(prev => [...prev, { role: 'bot', content: reply, time: nowTime() }]);
    } catch (error) {
      console.error('[Chatbot] Send failed:', error);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: t('chat.error') || 'कृपया पुन्हा प्रयत्न करा.',
        time: nowTime() 
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [loading, messages, t]);

  const handleSubmit = (e) => { e.preventDefault(); send(input); };
  const handleSugg   = (s) => send(s);

  const chatH = compact ? 'h-64' : 'h-80 sm:h-96';

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-forest-100 shadow-card bg-white flex flex-col animate-fade-in">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-forest-700 to-forest-600 border-b border-forest-600">
        <div className="relative">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6 2 3 8 3 12c0 4.5 3 8 9 8s9-3.5 9-8c0-4-3-8-9-8z" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.2"/>
              <path d="M12 20V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-forest-700" />
        </div>
        <div>
          <p className="font-sans font-semibold text-white text-sm leading-tight">AgroVision Assistant</p>
          <p className="text-[11px] text-white/70 font-sans">AI-powered agronomy advisor</p>
        </div>
        <span className="ml-auto text-[10px] font-mono bg-white/15 text-white px-2 py-1 rounded-full">Online</span>
      </div>

      {/* Messages */}
      <div className={`${chatH} overflow-y-auto chat-scroll px-4 py-4 space-y-3 bg-forest-50/40`}>
        {messages.map((m, i) => <Bubble key={i} msg={m} />)}
        {loading && <TypingIndicator />}

        {/* Suggestions */}
        {showSugg && messages.length === 1 && !loading && (
          <div className="pt-1 space-y-1.5">
            <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-gray-400 px-1">{t('chat.try_asking')}</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => handleSugg(s)}
                  className="text-xs font-sans bg-white border border-forest-200 text-forest-700 hover:bg-forest-50 hover:border-forest-400 px-3 py-1.5 rounded-full transition-all duration-200 active:scale-95">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit}
        className="flex items-center gap-2 px-3 py-3 border-t border-forest-100 bg-white">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={t('chat.placeholder')}
          disabled={loading}
          className="flex-1 bg-forest-50 border border-forest-200 rounded-xl px-3.5 py-2.5 text-sm font-sans text-gray-700 placeholder-gray-400 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-200 transition-all disabled:opacity-50"
          aria-label="Chat message"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 flex-shrink-0
            ${loading || !input.trim()
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-forest-600 text-white hover:bg-forest-700 active:scale-95 shadow-sm'}`}
          aria-label="Send message"
        >
          {loading
            ? <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2"/><path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            : <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg"><path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z"/></svg>
          }
        </button>
      </form>
    </div>
  );
};

export default Chatbot;