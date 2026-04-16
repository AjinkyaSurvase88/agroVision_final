/**
 * Result.jsx — Disease prediction result with Marathi disease info, treatment, and prevention
 */
import React, { useEffect, useState } from 'react';
import { useTranslation } from '../context/LanguageContext';

const isHealthy = d => /healthy|normal|good/i.test(d);
const toPct     = c => Math.round(c > 1 ? c : c * 100);
const severityLabel = (pct, h, t) => {
  if (h) return t('result.healthy');
  if (pct >= 85) return t('result.high_confidence');
  if (pct >= 60) return t('result.moderate_confidence');
  return t('result.low_confidence');
};

// Information tab component
const InfoTab = ({ icon, label, content, color }) => (
  <div className={`rounded-lg p-3 border ${color}`}>
    <div className="flex items-start gap-2">
      <span className="text-lg flex-shrink-0">{icon}</span>
      <div className="flex-1">
        <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">{label}</p>
        <p className="text-sm leading-relaxed text-gray-800 font-sans">{content}</p>
      </div>
    </div>
  </div>
);

const Result = ({ result, onReset }) => {
  const [barW, setBarW] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { t } = useTranslation();
  const pct      = toPct(result.confidence);
  const healthy  = isHealthy(result.disease);
  const severity = severityLabel(pct, healthy, t);

  // Handle text-to-speech
  const speakInMarathi = () => {
    if ('speechSynthesis' in window) {
      // Stop if already speaking
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      // Combine formatted text with section headers
      let fullText = '';
      
      if (result.symptoms) {
        fullText += `रोगाचे लक्षणे. ${result.symptoms}. `;
      }
      
      if (result.treatment) {
        fullText += `उपचार. ${result.treatment}. `;
      }

      // Add safety warnings
      fullText += `महत्वाचे सावधानी. शिडकाव करण्यापूर्वी संपूर्ण निर्देश वाचा. दस्ताने, मुखवटा आणि कपडे वापरा. शिडकाव करणे असूनसही व्यक्तीशी नेहमी संपर्क साधा. अनुभवी कृषी अधिकारीचा सल्ला घ्या. `;
      
      if (result.prevention) {
        fullText += `प्रतिबंध. ${result.prevention}.`;
      }

      if (!fullText.trim()) {
        alert('कोणतीही माहिती उपलब्ध नाही');
        return;
      }

      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.lang = 'mr-IN'; // Marathi language
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert('आपल्या ब्राउजरमध्ये ऑडिओ वैशिष्ट्य उपलब्ध नाही');
    }
  };


  useEffect(() => { 
    const timer = setTimeout(() => setBarW(pct), 100); 
    return () => {
      clearTimeout(timer);
      // Stop audio when component unmounts
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [pct]);

  const T = healthy ? {
    badge:    'bg-healthy-light text-healthy-dark border border-green-200',
    bar:      'bg-gradient-to-r from-forest-400 to-forest-600',
    barBg:    'bg-forest-100',
    iconBg:   'bg-healthy-light text-forest-600 ring-forest-200',
    heading:  'text-forest-900',
    label:    'text-forest-700',
    border:   'border-forest-200',
    tip:      'bg-forest-50 border-forest-100',
    tipText:  'text-forest-800', tipLabel: 'text-forest-600',
  } : {
    badge:    'bg-disease-light text-disease-dark border border-red-200',
    bar:      'bg-gradient-to-r from-red-400 to-red-600',
    barBg:    'bg-red-50',
    iconBg:   'bg-red-50 text-red-500 ring-red-200',
    heading:  'text-red-900',
    label:    'text-red-700',
    border:   'border-red-200',
    tip:      'bg-red-50 border-red-100',
    tipText:  'text-red-800', tipLabel: 'text-red-600',
  };

  return (
    <div className="w-full animate-scale-in space-y-4">
      {/* Main Result Card */}
      <div className={`relative overflow-hidden rounded-2xl border ${T.border} bg-white shadow-result`}>
        <div className={`h-1.5 w-full ${healthy ? 'bg-gradient-to-r from-forest-400 to-forest-600' : 'bg-gradient-to-r from-red-400 to-red-600'}`} />
        <div className="p-5 sm:p-6">

          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ring-2 flex-shrink-0 ${T.iconBg}`}>
                {healthy ? (
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6 2 3 8 3 12c0 4.5 3 8 9 8s9-3.5 9-8c0-4-3-8-9-8z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div>
                <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-gray-400 mb-0.5">{t('result.detection_result')}</p>
                <span className={`inline-flex items-center gap-1 text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full ${T.badge}`}>
                  {healthy ? '✅' : '⚠️'} {severity}
                </span>
              </div>
            </div>
            <button onClick={onReset}
              className="flex-shrink-0 text-xs font-sans font-medium text-gray-400 hover:text-forest-600 transition-colors flex items-center gap-1 group">
              <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5 group-hover:-rotate-45 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 10a6 6 0 1012 0 6 6 0 00-12 0zM4 10H1m3 0l2-2m-2 2l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t('result.new_scan')}
            </button>
          </div>

          {/* Marathi Disease Name - Big and Bold */}
          <div className="mb-5 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg">
            <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-orange-600 mb-1">🇮🇳 मराठी नाव</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-orange-900 leading-tight">
              {result.marathi_disease || result.disease}
            </h2>
            <p className="text-xs text-orange-700 mt-2">English: {result.disease}</p>
          </div>

          {/* Listen Button - आईका */}
          <button
            onClick={speakInMarathi}
            className={`w-full mb-5 px-4 py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              isSpeaking
                ? 'bg-red-500 text-white shadow-lg animate-pulse'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${isSpeaking ? 'animate-bounce' : ''}`} xmlns="http://www.w3.org/2000/svg">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" fill="currentColor"/>
              <path d="M17 16.91c-1.48 1.45-3.76 2.36-6 2.36s-4.52-.91-6-2.36m12-2.02h.01M5 16.91h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {isSpeaking ? '⏸️ आईका चालू आहे...' : '🔊 आईका ऐका'}
          </button>

          {/* Severity and Status */}
          {!healthy && (
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className={`p-3 rounded-lg border ${T.border} bg-white`}>
                <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-gray-400 mb-1">गंभीरता</p>
                <p className="text-sm font-bold text-gray-800">{result.severity || 'N/A'}</p>
              </div>
              <div className={`p-3 rounded-lg border ${T.border} bg-white`}>
                <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-gray-400 mb-1">स्थिति</p>
                <p className="text-sm font-bold text-gray-800">{result.status || 'N/A'}</p>
              </div>
            </div>
          )}

          {/* Confidence bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-gray-400">आत्मविश्वास</p>
              <p className={`font-mono text-base font-bold ${T.label}`}>{pct}%</p>
            </div>
            <div className={`w-full h-2.5 rounded-full ${T.barBg} overflow-hidden`}>
              <div className={`h-full rounded-full ${T.bar} confidence-bar-fill`} style={{ width: `${barW}%` }}
                role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} />
            </div>
          </div>
        </div>
      </div>

      {/* Information Sections for Farmers - Only if diseased */}
      {!healthy && (
        <div className="space-y-3">
          {/* Symptoms Section */}
          {result.symptoms && (
            <InfoTab 
              icon="🔍"
              label="रोगाचे लक्षणे (Disease Symptoms)"
              content={result.symptoms}
              color="border-red-200 bg-red-50"
            />
          )}

          {/* Treatment Section */}
          {result.treatment && (
            <div className="space-y-3">
              <InfoTab 
                icon="💊"
                label="उपचार / औषधे (Treatment)"
                content={result.treatment}
                color="border-blue-200 bg-blue-50"
              />
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3.5">
                <p className="text-xs font-semibold text-yellow-800 flex items-center gap-2">
                  <span>⚠️</span> महत्वाचे सावधानी
                </p>
                <ul className="text-xs text-yellow-900 mt-2 space-y-1.5 list-disc list-inside">
                  <li>शिडकाव करण्यापूर्वी संपूर्ण निर्देश वाचा</li>
                  <li>दस्ताने, मुखवटा आणि कपडे वापरा</li>
                  <li>शिडकाव करणे असूनसही व्यक्तीशी नेहमी संपर्क साधा</li>
                  <li>अनुभवी कृषी अधिकारीचा सल्ला घ्या</li>
                </ul>
              </div>
            </div>
          )}

          {/* Prevention Section */}
          {result.prevention && (
            <InfoTab 
              icon="🛡️"
              label="प्रतिबंध / रोकथाम (Prevention)"
              content={result.prevention}
              color="border-green-200 bg-green-50"
            />
          )}
        </div>
      )}

      {/* Recommendation Card */}
      <div className={`rounded-xl p-4 ${T.tip} border`}>
        <p className={`text-[10px] font-mono font-semibold uppercase tracking-widest mb-2 ${T.tipLabel}`}>
          {healthy ? '✓ शिफारस' : '⚠ कृती आवश्यक'}
        </p>
        <p className={`text-sm font-sans leading-relaxed ${T.tipText}`}>
          {healthy
            ? '🌾 आपल्या पिकाची स्थिती चांगली आहे! नियमितपणे पाणी द्या, संतुलित खत वापरा आणि रोगांचे लक्षण पहा.'
            : '🚨 कृपया लक्षणांचे विश्लेषण करा. योग्य औषधे शिडवा आणि संक्रमित पिके वेगळे करा. प्रमाणित कृषी तज्ञांशी सल्ला घ्या.'}
        </p>
      </div>

      <p className="text-center text-[11px] text-gray-500 font-sans">
        🤖 AI द्वारा तयार — प्रमाणित कृषी तज्ञांशी सत्यापित करा। 
      </p>
    </div>
  );
};

export default Result;