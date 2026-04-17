/**
 * Chatbot.jsx — AgroVision AI Assistant
 * Fully tap-driven: main menu → answer → topic follow-up questions → answer…
 * Farmers never need to type a single word.
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sendMessage } from '../services/chatbotApi';

// ─────────────────────────────────────────────────────────────────
// Menu: each topic has an icon, Marathi label, query sent to backend,
// and a list of follow-up questions shown AFTER the bot answers.
// ─────────────────────────────────────────────────────────────────
const MENU_ITEMS = [
  {
    emoji: '🟣', label: 'जांभूळ डाग रोग',
    query: 'जांभूळ डाग रोग (purple blotch) बद्दल माहिती द्या.',
    followUps: [
      { label: 'लक्षणे काय आहेत?',        query: 'जांभूळ डाग रोगाची लक्षणे कोणती?' },
      { label: 'फवारणी कोणती करावी?',      query: 'जांभूळ डाग रोगासाठी कोणते बुरशीनाशक व किती मात्रा वापरावी?' },
      { label: 'रोग कसा पसरतो?',           query: 'जांभूळ डाग रोग कसा पसरतो?' },
      { label: 'प्रतिबंध कसा करावा?',      query: 'जांभूळ डाग रोग होऊ नये म्हणून काय करावे?' },
    ]
  },
  {
    emoji: '💧', label: 'ओसी चिलमिरी',
    query: 'ओसी चिलमिरी रोग (downy mildew) बद्दल माहिती द्या.',
    followUps: [
      { label: 'लक्षणे काय आहेत?',         query: 'ओसी चिलमिरी रोगाची लक्षणे कोणती?' },
      { label: 'उपचार व फवारणी काय?',      query: 'ओसी चिलमिरीसाठी कोणते औषध व किती मात्रा वापरावी?' },
      { label: 'कोणत्या हवामानात होतो?',   query: 'ओसी चिलमिरी कोणत्या हवामानात जास्त होतो?' },
      { label: 'प्रतिबंध कसा करावा?',      query: 'ओसी चिलमिरी होऊ नये म्हणून काय करावे?' },
    ]
  },
  {
    emoji: '🟤', label: 'पान करपा',
    query: 'stemphylium leaf blight पान करपा रोग बद्दल माहिती द्या.',
    followUps: [
      { label: 'लक्षणे काय आहेत?',         query: 'पान करपा रोगाची लक्षणे कोणती?' },
      { label: 'कोणते बुरशीनाशक वापरावे?', query: 'पान करपा रोगासाठी कोणते बुरशीनाशक व मात्रा?' },
      { label: 'बोट्रायटिस व स्टेम्फिलियम फरक?', query: 'बोट्रायटिस आणि स्टेम्फिलियम पान करपा यात फरक काय?' },
      { label: 'प्रतिबंध कसा करावा?',      query: 'पान करपा होऊ नये म्हणून काय करावे?' },
    ]
  },
  {
    emoji: '⚫', label: 'कांदा गळ सड',
    query: 'कांदा गळ सड रोग (bulb rot fusarium) बद्दल माहिती द्या.',
    followUps: [
      { label: 'लक्षणे काय आहेत?',         query: 'कांदा गळ सड रोगाची लक्षणे कोणती?' },
      { label: 'साठवणुकीत कसे टाळावे?',   query: 'साठवणुकीमध्ये कांदा कसा खराब होऊ नये?' },
      { label: 'उपचार काय?',               query: 'कांदा गळ सड रोगावर कोणते उपचार करावे?' },
      { label: 'प्रतिबंध कसा करावा?',      query: 'कांदा गळ सड होऊ नये म्हणून काय करावे?' },
    ]
  },
  {
    emoji: '🔴', label: 'तांबेरा रोग',
    query: 'तांबेरा रोग (rust) बद्दल माहिती द्या.',
    followUps: [
      { label: 'लक्षणे काय आहेत?',         query: 'तांबेरा रोगाची लक्षणे कोणती?' },
      { label: 'कोणती फवारणी करावी?',       query: 'तांबेरा रोगासाठी कोणते बुरशीनाशक व मात्रा?' },
      { label: 'कधी जास्त होतो?',          query: 'तांबेरा रोग कोणत्या ऋतूत जास्त होतो?' },
      { label: 'प्रतिबंध कसा करावा?',      query: 'तांबेरा रोग होऊ नये म्हणून काय करावे?' },
    ]
  },
  {
    emoji: '🦟', label: 'थ्रिप्स / अळी',
    query: 'थ्रिप्स आणि अळी कीटक बद्दल माहिती द्या.',
    followUps: [
      { label: 'थ्रिप्स ओळखणे कसे?',       query: 'थ्रिप्स कीटक कसे ओळखावे?' },
      { label: 'कोणते कीटकनाशक वापरावे?',  query: 'थ्रिप्स आणि अळीसाठी कोणते कीटकनाशक व मात्रा?' },
      { label: 'नैसर्गिक उपाय काय?',       query: 'थ्रिप्स आणि अळी नियंत्रणासाठी नैसर्गिक उपाय कोणते?' },
      { label: 'व्हायरसशी काय संबंध?',     query: 'थ्रिप्स आणि व्हायरस रोग यांचा काय संबंध आहे?' },
    ]
  },
  {
    emoji: '🌿', label: 'निरोगी पिकाची काळजी',
    query: 'माझे कांदा पीक निरोगी आहे. काळजी कशी घ्यावी सांगा.',
    followUps: [
      { label: 'पाणी किती द्यावे?',        query: 'कांदा पिकाला पाणी किती व कसे द्यावे?' },
      { label: 'खत कधी द्यावे?',           query: 'निरोगी कांदा पिकाला खत कधी व किती द्यावे?' },
      { label: 'प्रतिबंधक फवारणी?',        query: 'कांदा पिकावर प्रतिबंधक फवारणी कधी करावी?' },
      { label: 'पीक काढणी केव्हा?',        query: 'कांदा कधी काढणीसाठी तयार होतो?' },
    ]
  },
  {
    emoji: '💊', label: 'फवारणी व औषध',
    query: 'कांदा रोगांवर फवारणी आणि औषध मात्रा सांगा.',
    followUps: [
      { label: 'बुरशीनाशकांची यादी?',      query: 'कांदा रोगांसाठी प्रमुख बुरशीनाशके कोणती व मात्रा किती?' },
      { label: 'फवारणी कधी करावी?',        query: 'फवारणी सकाळी, संध्याकाळी किंवा दुपारी केव्हा करावी?' },
      { label: 'औषधे आलटून पालटून वापरावी का?', query: 'एकच औषध सतत वापरणे चांगले का? resistance म्हणजे काय?' },
      { label: 'कोणती काळजी घ्यावी?',      query: 'फवारणी करताना शेतकऱ्याने कोणती काळजी घ्यावी?' },
    ]
  },
  {
    emoji: '🛡️', label: 'रोग प्रतिबंध',
    query: 'कांदा पिकाचे रोगांपासून संरक्षण कसे करावे?',
    followUps: [
      { label: 'बियाणे कसे निवडावे?',      query: 'रोगमुक्त कांदा बियाणे कसे निवडावे व बीजोपचार कसा करावा?' },
      { label: 'पिके फेरपालट म्हणजे काय?', query: 'पिके फेरपालट (crop rotation) म्हणजे काय व का करावे?' },
      { label: 'जलभराव का टाळावा?',        query: 'जलभराव टाळणे रोग प्रतिबंधासाठी का महत्वाचे?' },
      { label: 'ठिबक सिंचन का वापरावे?',   query: 'ठिबक सिंचन वापरल्याने रोग कमी होतात का? कसे?' },
    ]
  },
  {
    emoji: '🌱', label: 'खत व्यवस्थापन',
    query: 'कांदा पिकासाठी खत व्यवस्थापन सांगा.',
    followUps: [
      { label: 'NPK किती द्यावे?',         query: 'कांदा पिकासाठी NPK खत किती प्रमाणात द्यावे?' },
      { label: 'सूक्ष्म अन्नद्रव्ये कोणती?', query: 'कांदा पिकासाठी कोणती सूक्ष्म अन्नद्रव्ये महत्वाची आहेत?' },
      { label: 'जास्त खत दिल्यास काय होते?', query: 'कांदा पिकावर जास्त नायट्रोजन खत दिल्यास काय होते?' },
      { label: 'शेणखत वापरावे का?',        query: 'कांदा पिकासाठी शेणखत किंवा सेंद्रिय खत वापरावे का?' },
    ]
  },
  {
    emoji: '🌧️', label: 'हवामान व रोग',
    query: 'हवामान आणि कांदा रोग यांचा काय संबंध आहे?',
    followUps: [
      { label: 'पावसाळ्यात काय करावे?',    query: 'पावसाळ्यात कांदा पिकाची काळजी कशी घ्यावी?' },
      { label: 'उष्ण हवामानात काय?',       query: 'उन्हाळ्यात कांदा पिकास कोणते रोग होतात?' },
      { label: 'थंडीत पीक कसे राखावे?',   query: 'हिवाळ्यात कांदा पिकाचे संरक्षण कसे करावे?' },
      { label: 'आर्द्रता जास्त असल्यास?',  query: 'आर्द्रता जास्त असताना कांदा पिकाला कोणत्या रोगांचा धोका?' },
    ]
  },
  {
    emoji: '📷', label: 'ॲप कसे वापरावे',
    query: 'AgroVision ॲप मध्ये रोग कसा शोधायचा ते सांगा.',
    followUps: [
      { label: 'फोटो कसा घ्यावा?',         query: 'चांगला फोटो कसा घ्यावा जेणेकरून AI अचूक ओळखेल?' },
      { label: 'परिणाम समजावून सांगा?',    query: 'रोग ओळख परिणाम (confidence percentage) म्हणजे काय?' },
      { label: 'कॅमेरा कसे वापरावे?',      query: 'फोटो अपलोड करण्यासाठी मोबाईल कॅमेरा कसे वापरावे?' },
      { label: 'इतिहास कुठे दिसतो?',      query: 'माझ्या मागील स्कॅनचा इतिहास कुठे पाहता येतो?' },
    ]
  },
];

// ── Bold markdown renderer ─────────────────────────────────────────
const renderMarkdown = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i} className="font-semibold">{p.slice(2, -2)}</strong>
      : p
  );
};

// ── Bubbles ────────────────────────────────────────────────────────
const BotBubble = ({ content, time }) => (
  <div className="flex items-end gap-2 bubble-enter">
    <div className="w-7 h-7 rounded-full bg-forest-600 flex items-center justify-center flex-shrink-0 mb-0.5">
      <span className="text-white text-[10px] font-bold">AI</span>
    </div>
    <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl rounded-bl-sm bg-white border border-forest-100 text-gray-700 text-sm font-sans leading-relaxed shadow-sm">
      {content.split('\n').map((line, i) => (
        <p key={i} className={line === '' ? 'mt-1' : ''}>{renderMarkdown(line)}</p>
      ))}
      <p className="text-[10px] mt-1.5 text-gray-400">{time}</p>
    </div>
  </div>
);

const UserBubble = ({ content, time }) => (
  <div className="flex items-end gap-2 flex-row-reverse bubble-enter">
    <div className="max-w-[80%] px-3.5 py-2.5 rounded-2xl rounded-br-sm bg-forest-600 text-white text-sm font-sans leading-relaxed">
      {content}
      <p className="text-[10px] mt-1.5 text-white/60">{time}</p>
    </div>
  </div>
);

const TypingIndicator = () => (
  <div className="flex items-end gap-2 bubble-enter">
    <div className="w-7 h-7 rounded-full bg-forest-600 flex items-center justify-center flex-shrink-0">
      <span className="text-white text-[10px] font-bold">AI</span>
    </div>
    <div className="bg-white border border-forest-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
      {[0,1,2].map(i => (
        <span key={i} className="w-1.5 h-1.5 rounded-full bg-forest-400 animate-bounce"
          style={{ animationDelay: `${i*150}ms` }} />
      ))}
    </div>
  </div>
);

const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// ─────────────────────────────────────────────────────────────────
const Chatbot = ({ compact = false }) => {
  const WELCOME = {
    role: 'bot',
    content: 'नमस्कार, शेतकरी बांधवांनो! 🌱\n\nमी **AgroVision AI सहायक** आहे.\nखालील विषयातून एक निवडा:',
    time: nowTime(),
  };

  const [messages,     setMessages]     = useState([WELCOME]);
  const [loading,      setLoading]      = useState(false);
  const [input,        setInput]        = useState('');
  // 'menu' | 'followup' | 'free'
  const [stage,        setStage]        = useState('menu');
  const [activeItem,   setActiveItem]   = useState(null);   // current MENU_ITEM
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // Auto-scroll
  useEffect(() => {
    const el = bottomRef.current?.parentElement;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading, stage]);

  // ── Send any query ────────────────────────────────────────────
  const sendQuery = useCallback(async (userLabel, backendQuery) => {
    if (loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userLabel, time: nowTime() }]);
    setLoading(true);
    try {
      const reply = await sendMessage(backendQuery || userLabel);
      setMessages(prev => [...prev, { role: 'bot', content: reply, time: nowTime() }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'bot', content: 'क्षमा करा, काहीतरी चुकले. कृपया पुन्हा प्रयत्न करा.', time: nowTime(),
      }]);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // ── Tap main menu item ────────────────────────────────────────
  const handleMenuTap = useCallback(async (item) => {
    setActiveItem(item);
    setStage('followup');
    await sendQuery(item.emoji + ' ' + item.label, item.query);
  }, [sendQuery]);

  // ── Tap a follow-up button ────────────────────────────────────
  const handleFollowUpTap = useCallback(async (fu) => {
    await sendQuery(fu.label, fu.query);
  }, [sendQuery]);

  // ── Type & send ───────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setStage('free');
    sendQuery(q, q);
  };

  const goBackToMenu = () => {
    setActiveItem(null);
    setStage('menu');
  };

  const chatH = compact ? 'h-72' : 'h-[380px] sm:h-[440px]';

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-forest-100 shadow-card bg-white flex flex-col animate-fade-in">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-forest-700 to-forest-600 border-b border-forest-600">
        <div className="relative">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-forest-700" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-sans font-semibold text-white text-sm leading-tight">AgroVision सहायक</p>
          <p className="text-[11px] text-white/70 font-sans">कांदा शेती AI मार्गदर्शक</p>
        </div>
        {stage !== 'menu' && (
          <button onClick={goBackToMenu}
            className="flex items-center gap-1 text-[11px] font-sans font-medium text-white/80 bg-white/15 hover:bg-white/25 px-2.5 py-1.5 rounded-lg transition-colors flex-shrink-0">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
              <path fillRule="evenodd" d="M14 8a.75.75 0 01-.75.75H4.56l3.22 3.22a.75.75 0 11-1.06 1.06l-4.5-4.5a.75.75 0 010-1.06l4.5-4.5a.75.75 0 011.06 1.06L4.56 7.25h8.69A.75.75 0 0114 8z" clipRule="evenodd"/>
            </svg>
            मुख्य मेनू
          </button>
        )}
        <span className="text-[10px] font-mono bg-white/15 text-white px-2 py-1 rounded-full flex-shrink-0">Online</span>
      </div>

      {/* ── Chat area ── */}
      <div className={`${chatH} overflow-y-auto chat-scroll px-4 py-4 bg-forest-50/40 flex flex-col gap-3`}>

        {messages.map((m, i) =>
          m.role === 'bot'
            ? <BotBubble key={i} content={m.content} time={m.time} />
            : <UserBubble key={i} content={m.content} time={m.time} />
        )}
        {loading && <TypingIndicator />}

        {/* ── STAGE: Main 12-topic menu ── */}
        {stage === 'menu' && !loading && (
          <div className="mt-1">
            <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-gray-400 mb-2 px-1">
              विषय निवडा 👇
            </p>
            <div className="grid grid-cols-2 gap-2">
              {MENU_ITEMS.map(item => (
                <button key={item.label} onClick={() => handleMenuTap(item)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-forest-200 text-left hover:bg-forest-50 hover:border-forest-400 active:scale-95 transition-all shadow-sm">
                  <span className="text-base flex-shrink-0">{item.emoji}</span>
                  <span className="text-xs font-sans font-semibold text-forest-800 leading-tight">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STAGE: Follow-up question buttons for active topic ── */}
        {stage === 'followup' && !loading && activeItem && (
          <div className="mt-1">
            <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-gray-400 mb-2 px-1">
              पुढील प्रश्न विचारा 👇
            </p>
            <div className="flex flex-col gap-2">
              {activeItem.followUps.map((fu, i) => (
                <button key={i} onClick={() => handleFollowUpTap(fu)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white border border-forest-200 text-left hover:bg-forest-50 hover:border-forest-500 active:scale-[0.98] transition-all shadow-sm w-full">
                  <span className="w-5 h-5 rounded-full bg-forest-100 text-forest-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm font-sans text-forest-900">{fu.label}</span>
                </button>
              ))}
              {/* Also show "Back to main menu" as a button */}
              <button onClick={goBackToMenu}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-left hover:bg-gray-100 active:scale-[0.98] transition-all w-full mt-1">
                <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3">
                    <path fillRule="evenodd" d="M10 6a.5.5 0 01-.5.5H3.21l2.15 2.15a.5.5 0 11-.71.7l-3-3a.5.5 0 010-.7l3-3a.5.5 0 01.71.7L3.21 5.5H9.5A.5.5 0 0110 6z" clipRule="evenodd"/>
                  </svg>
                </span>
                <span className="text-sm font-sans text-gray-500">सर्व विषय पाहा</span>
              </button>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Text input (always available as option) ── */}
      <form onSubmit={handleSubmit}
        className="flex items-center gap-2 px-3 py-3 border-t border-forest-100 bg-white">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="किंवा आपला प्रश्न इथे टाइप करा..."
          disabled={loading}
          className="flex-1 bg-forest-50 border border-forest-200 rounded-xl px-3.5 py-2.5 text-sm font-sans text-gray-700 placeholder-gray-400 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-200 transition-all disabled:opacity-50"
          aria-label="Chat message"
        />
        <button type="submit" disabled={loading || !input.trim()}
          className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 flex-shrink-0
            ${loading || !input.trim()
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-forest-600 text-white hover:bg-forest-700 active:scale-95 shadow-sm'}`}
          aria-label="Send">
          {loading
            ? <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2"/><path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            : <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z"/></svg>
          }
        </button>
      </form>
    </div>
  );
};

export default Chatbot;