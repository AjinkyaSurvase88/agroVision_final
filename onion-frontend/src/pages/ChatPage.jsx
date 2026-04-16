/**
 * ChatPage.jsx — AgroVision AI Chat (Farmer-Ready)
 * Full-screen dedicated AI chat page with Marathi support
 */
import React from 'react';
import Chatbot from '../components/Chatbot';
import { useTranslation } from '../context/LanguageContext';

// ── Feature highlight card ─────────────────────────────────────────
const FeatureCard = ({ icon, title, desc }) => (
  <div className="flex items-start gap-3 bg-white rounded-2xl border border-forest-100 p-4 shadow-card
    hover:border-forest-300 hover:shadow-card-hover transition-all duration-200">
    <span className="text-2xl flex-shrink-0" aria-hidden="true">{icon}</span>
    <div>
      <p className="font-sans font-semibold text-gray-800 text-sm">{title}</p>
      <p className="text-xs font-sans text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
    </div>
  </div>
);

// ── Sample question chip ───────────────────────────────────────────
const QuickQ = ({ text }) => (
  <div className="inline-flex items-center gap-1.5 bg-forest-50 border border-forest-200
    rounded-full px-3 py-1.5 text-xs font-sans text-forest-700">
    <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 text-forest-500 flex-shrink-0"
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 3v2m0 2h.01"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
    {text}
  </div>
);

const ChatPage = () => {
  const { t } = useTranslation();

  const FEATURES = [
    { 
      icon: '🔬', 
      title: t('chat.disease_id') || 'Disease Identification',  
      desc: t('chat.disease_desc') || 'Ask about any onion crop disease — symptoms, causes, and spread patterns.' 
    },
    { 
      icon: '💊', 
      title: t('chat.treatment_advice') || 'Treatment Advice',         
      desc: t('chat.treatment_desc') || 'Get targeted fungicide, pesticide, and cultural control recommendations.' 
    },
    { 
      icon: '🌱', 
      title: t('chat.prevention') || 'Prevention Strategies',   
      desc: t('chat.prevention_desc') || 'Learn crop rotation, seed selection, and proactive scouting techniques.' 
    },
    { 
      icon: '🌦️', 
      title: t('chat.weather_guidance') || 'Weather-Based Guidance', 
      desc: t('chat.weather_desc') || 'Understand how humidity and temperature affect disease pressure.' 
    },
  ];

  const QUICK_QUESTIONS = [
    t('chat.suggestion1') || 'What causes Purple Blotch?',
    t('chat.suggestion2') || 'Treatment for Downy Mildew?',
    t('chat.suggestion3') || 'How to prevent Stemphylium?',
    t('chat.suggestion4') || 'Prevention tips for onion diseases',
    t('chat.suggestion5') || 'AI model accuracy explained',
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 page-enter">

    {/* Page header */}
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2 bg-forest-100 border border-forest-200
        rounded-full px-4 py-1.5 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-forest-500 animate-pulse" />
        <span className="text-xs font-mono font-semibold text-forest-700 uppercase tracking-wider">
          {t('chat.online') || 'AI Assistant Online'}
        </span>
      </div>
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-forest-900 mb-2">
        {t('chat.title') || 'AgroVision AI Chat'}
      </h1>
      <p className="text-sm font-sans text-gray-500 max-w-md mx-auto leading-relaxed">
        {t('chat.subtitle') || 'Your AI-powered agronomy advisor. Ask about crop diseases, treatments, prevention strategies, and smart farming techniques.'}
      </p>
    </div>

    {/* Main layout */}
    <div className="grid lg:grid-cols-3 gap-6">

      {/* Chat panel — takes 2/3 on large screens */}
      <div className="lg:col-span-2 animate-fade-up delay-100">
        <Chatbot compact={false} />
      </div>

      {/* Sidebar */}
      <div className="space-y-5 animate-fade-up delay-200">

        {/* Capabilities */}
        <div>
          <p className="text-[10px] font-mono font-semibold uppercase tracking-widest
            text-gray-400 mb-3">{t('chat.capabilities') || 'What I can help with'}</p>
          <div className="space-y-3">
            {FEATURES.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>

        {/* Sample questions */}
        <div className="bg-white rounded-2xl border border-forest-100 shadow-card p-4">
          <p className="text-[10px] font-mono font-semibold uppercase tracking-widest
            text-gray-400 mb-3">{t('chat.try_asking') || 'Try asking…'}</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_QUESTIONS.map(q => <QuickQ key={q} text={q} />)}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-start gap-2.5">
            <span className="text-amber-500 text-base flex-shrink-0" aria-hidden="true">⚠️</span>
            <div>
              <p className="text-xs font-sans font-semibold text-amber-800 mb-1">
                सल्ल्याचा अस्वीकरण
              </p>
              <p className="text-xs font-sans text-amber-700 leading-relaxed">
                AI प्रतिसाद केवळ शैक्षणिक मार्गदर्शनासाठी आहे. शेतीत उपयोग करण्यापूर्वी नेहमी प्रमाणित कृषिशास्त्रज्ञाशी रोग निदान आणि उपचार निर्णय सत्यापित करा.
              </p>
            </div>
          </div>
        </div>

        {/* Backend status note */}
        <div className="bg-white rounded-2xl border border-forest-100 p-4 shadow-card">
          <p className="text-[10px] font-mono font-semibold uppercase tracking-widest
            text-gray-400 mb-2">API कनेक्शन</p>
          <div className="space-y-2">
            {[
              { label: 'रोग शोधण्याची सेवा', endpoint: '/predict/',  status: 'active'  },
              { label: 'AI चॅट बॅकएंड',   endpoint: '/chat/',     status: 'fallback' },
            ].map(({ label, endpoint, status }) => (
              <div key={endpoint} className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-sans font-medium text-gray-700">{label}</p>
                  <p className="text-[10px] font-mono text-gray-400">{endpoint}</p>
                </div>
                <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full
                  ${status === 'active'
                    ? 'bg-healthy-light text-healthy-dark'
                    : 'bg-amber-50 text-amber-700'}`}>
                  {status === 'active' ? '● सक्रिय' : '◐ लोकल'}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] font-sans text-gray-400 mt-3 leading-relaxed">
            जेव्हा <code className="font-mono bg-gray-100 px-1 rounded">POST /chat/</code> उपलब्ध नसते तेव्हा चॅट स्थानिक फॉलबॅक प्रतिसाद वापरते. संपूर्ण AI प्रतिसादांसाठी आपला FastAPI बॅकएंड कनेक्ट करा.
          </p>
        </div>

      </div>
    </div>
  </div>
  );
};

export default ChatPage;