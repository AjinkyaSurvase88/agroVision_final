/**
 * OnionInfo.jsx — Comprehensive Onion Crop Information for Farmers
 * Educational resource with crop details, diseases, and management practices
 */

import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';

// ── Info Card Component ────────────────────────────────────────────
const InfoCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-2xl border border-forest-100 shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-200">
    <div className="bg-gradient-to-r from-forest-700 to-forest-600 px-4 py-3 flex items-center gap-3">
      <span className="text-2xl flex-shrink-0" aria-hidden="true">{icon}</span>
      <h3 className="text-lg font-sans font-semibold text-white">{title}</h3>
    </div>
    <div className="p-5 space-y-3 text-gray-700">
      {children}
    </div>
  </div>
);

// ── Disease Item ──────────────────────────────────────────────────
const DiseaseItem = ({ number, name, symptoms, treatment, prevention }) => (
  <div className="bg-white rounded-xl border border-forest-100 overflow-hidden hover:border-forest-300 transition-all duration-200">
    <div className="bg-forest-50 px-4 py-3 border-b border-forest-100">
      <h4 className="text-sm font-sans font-semibold text-forest-800">
        {number}. {name}
      </h4>
    </div>
    <div className="p-4 space-y-3">
      {symptoms && (
        <div>
          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-400 mb-1.5">लक्षणे</p>
          <ul className="text-sm space-y-1 text-gray-700 list-disc list-inside">
            {symptoms.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}
      {treatment && (
        <div>
          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-400 mb-1.5">उपचार</p>
          <ul className="text-sm space-y-1 text-gray-700 list-disc list-inside">
            {treatment.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      )}
      {prevention && (
        <div>
          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-400 mb-1.5">प्रतिबंध</p>
          <ul className="text-sm space-y-1 text-gray-700 list-disc list-inside">
            {prevention.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
      )}
    </div>
  </div>
);

// ── Stat Box ──────────────────────────────────────────────────────
const StatBox = ({ label, value }) => (
  <div className="bg-forest-50 rounded-xl p-3 border border-forest-100">
    <p className="text-xs text-gray-500 font-mono uppercase tracking-wide mb-1">{label}</p>
    <p className="text-lg font-sans font-semibold text-forest-800">{value}</p>
  </div>
);

const OnionInfo = () => {
  const { t } = useTranslation();
  const [expandedDisease, setExpandedDisease] = useState(null);

  // Disease data
  const diseases = [
    {
      number: 1,
      name: 'अल्टरनेरिया करपा (Alternaria)',
      symptoms: ['पानांवर तपकिरी गोल ठिपके', 'हळूहळू पान वाळते'],
      treatment: ['मॅन्कोझेब 2.5 ग्रॅम/लिटर पाणी फवारणी', 'क्लोरोथॅलोनील 2 ग्रॅम/लिटर', '7–10 दिवसांनी पुनः फवारणी'],
      prevention: ['पाणी साचू देऊ नका', 'रोगग्रस्त पाने काढा']
    },
    {
      number: 2,
      name: 'बोट्रायटिस पान करपा (Botrytis Leaf Blight)',
      symptoms: ['पांढरे/करडे डाग', 'पाने सुकतात'],
      treatment: ['कार्बेन्डाझिम 1 ग्रॅम/लिटर', 'इप्रोडायोन 2 ग्रॅम/लिटर'],
      prevention: ['दाट लागवड टाळा', 'हवा खेळती ठेवा']
    },
    {
      number: 3,
      name: 'कांदा गळ सड (Bulb Rot)',
      symptoms: ['गाठी मऊ होतात', 'सड येते'],
      treatment: ['कार्बेन्डाझिम 1 ग्रॅम/लिटर (मातीमध्ये)', 'ट्रायकोडर्मा वापरा'],
      prevention: ['साठवण कोरड्या ठिकाणी करा', 'पाणी साचू देऊ नका']
    },
    {
      number: 4,
      name: 'कांदा गाठी करपा (Bulb Blight)',
      symptoms: ['गाठीवर डाग', 'वाढ कमी होते'],
      treatment: ['मॅन्कोझेब 2.5 ग्रॅम/लिटर', 'कॅप्टन 2 ग्रॅम/लिटर']
    },
    {
      number: 5,
      name: 'अळी (Caterpillar)',
      symptoms: ['पाने खाल्ली जातात'],
      treatment: ['इमामेक्टिन बेन्झोएट 0.5 ग्रॅम/लिटर', 'स्पिनोसॅड 0.3 मिली/लिटर'],
      prevention: ['फेरोमोन ट्रॅप वापरा']
    },
    {
      number: 6,
      name: 'भुरी रोग (Downy Mildew)',
      symptoms: ['पानांवर पिवळे डाग', 'खाली बुरशी दिसते'],
      treatment: ['मेटालेक्सिल + मॅन्कोझेब 2 ग्रॅम/लिटर'],
      prevention: ['सकाळीच पाणी द्या', 'जास्त ओलावा टाळा']
    },
    {
      number: 7,
      name: 'फ्युजेरियम वाळवा (Fusarium)',
      symptoms: ['झाड वाळते'],
      treatment: ['कार्बेन्डाझिम 1 ग्रॅम/लिटर', 'ट्रायकोडर्मा वापरा'],
      prevention: ['पीक फेरपालट करा']
    },
    {
      number: 8,
      name: 'आयरिस पिवळा व्हायरस (Iris Yellow Virus)',
      symptoms: ['पाने पिवळी पडतात'],
      treatment: ['थ्रिप्स नियंत्रणासाठी इमिडाक्लोप्रिड 0.5 मिली/लिटर'],
      prevention: ['संक्रमित झाडे काढून टाका']
    },
    {
      number: 9,
      name: 'जांभळा करपा (Purple Blotch)',
      symptoms: ['जांभळे डाग'],
      treatment: ['मॅन्कोझेब 2.5 ग्रॅम/लिटर', 'अझॉक्सीस्ट्रोबिन 1 मिली/लिटर']
    },
    {
      number: 10,
      name: 'तांबेरा (Rust)',
      symptoms: ['केशरी/तपकिरी ठिपके'],
      treatment: ['हेक्साकोनाझोल 1 मिली/लिटर', 'प्रोपिकोनाझोल 1 मिली/लिटर']
    },
    {
      number: 11,
      name: 'व्हायरस रोग (Virosis)',
      symptoms: ['पाने वाकडी/पिवळी'],
      treatment: ['इमिडाक्लोप्रिड 0.5 मिली/लिटर'],
      prevention: ['Aphids नियंत्रण करा']
    },
    {
      number: 12,
      name: 'झॅन्थोमोनास पान करपा (Xanthomonas Leaf Blight)',
      symptoms: ['पिवळे/तपकिरी डाग'],
      treatment: ['कॉपर ऑक्सीक्लोराइड 3 ग्रॅम/लिटर', 'स्ट्रेप्टोसायक्लिन 0.1 ग्रॅम/लिटर']
    },
    {
      number: 13,
      name: 'स्टेम्फिलियम पान करपा (Stemphylium Leaf Blight)',
      symptoms: ['पान करपते'],
      treatment: ['टेबुकोनाझोल 1 मिली/लिटर', 'मॅन्कोझेब 2.5 ग्रॅम/लिटर']
    },
  ];

  return (
    <div className="min-h-screen bg-forest-50">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-forest-700 to-forest-600 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-5xl mb-4">🧅</div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">
            कांदा पिक संपूर्ण माहिती
          </h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            शेतकरी भाईंसाठी कांद्याच्या पिकाची संपूर्ण माहिती, रोग व्यवस्थापन आणि उपचार
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">

        {/* 1. पिकाची ओळख */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-display font-bold text-forest-900 mb-4">🌱 पिकाची ओळख</h2>
            <div className="bg-white rounded-2xl border border-forest-100 shadow-card p-6">
              <p className="text-gray-700 leading-relaxed text-base mb-4">
                कांदा हे भारतातील एक महत्वाचे भाजीपाला पीक आहे. याचा वापर रोजच्या आहारात मोठ्या प्रमाणावर केला जातो. योग्य व्यवस्थापन केल्यास हे पीक चांगला नफा देते.
              </p>
              <div className="bg-forest-50 rounded-xl p-4 border border-forest-100">
                <p className="text-sm text-forest-800">
                  <strong>वैज्ञानिक नाव:</strong> Allium cepa L. | <strong>कुटुंब:</strong> Amaryllidaceae
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. हवामान आणि माती */}
        <section>
          <h2 className="text-2xl font-display font-bold text-forest-900 mb-4">🌍 हवामान आणि माती</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <InfoCard title="हवामान आवश्यकता" icon="🌡️">
              <p className="text-sm"><strong>तापमान:</strong> 13°C ते 30°C</p>
              <p className="text-sm"><strong>वर्षा:</strong> 500-750 मिमी</p>
              <p className="text-sm"><strong>प्रकारः</strong> थंड ते मध्यम उष्ण</p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                <p className="text-xs text-amber-800">⚠️ अत्यधिक गरम किंवा उच्च ओलावा टाळा</p>
              </div>
            </InfoCard>
            <InfoCard title="माती आवश्यकता" icon="🌿">
              <p className="text-sm"><strong>प्रकार:</strong> हलकी ते मध्यम काळी जमीन</p>
              <p className="text-sm"><strong>pH स्तर:</strong> 6.0 ते 7.5</p>
              <p className="text-sm"><strong>निचरा:</strong> चांगला निचरा असलेली</p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                <p className="text-xs text-green-800">✓ दोमट किंवा वाळूच्या दोमट माती योग्य</p>
              </div>
            </InfoCard>
          </div>
        </section>

        {/* 3. लागवड पद्धत */}
        <section>
          <h2 className="text-2xl font-display font-bold text-forest-900 mb-4">🌾 लागवड पद्धत</h2>
          <InfoCard title="लागवडीची माहिती" icon="🌱">
            <div className="grid sm:grid-cols-2 gap-4">
              <StatBox label="बियाणे दर" value="8–10 किलो/हे" />
              <StatBox label="रोपांतर" value="6–8 आठवड्यांनी" />
              <StatBox label="ओळीतील अंतर" value="15 सेमी" />
              <StatBox label="झाडातील अंतर" value="10 सेमी" />
            </div>
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900">
                <strong>💡 सूचना:</strong> वर्षा ऋतूच्या आधी (जुलै-सप्टेंबर) लागवड करा
              </p>
            </div>
          </InfoCard>
        </section>

        {/* 4. पाणी व्यवस्थापन */}
        <section>
          <h2 className="text-2xl font-display font-bold text-forest-900 mb-4">💧 पाणी व्यवस्थापन</h2>
          <InfoCard title="पाणी देण्याचे टप्पे" icon="💧">
            <div className="space-y-3">
              <div className="border-l-4 border-forest-500 pl-3 py-2">
                <p className="font-semibold text-sm">सुरुवातीला</p>
                <p className="text-sm text-gray-600">7–10 दिवसांनी पाणी द्या</p>
              </div>
              <div className="border-l-4 border-forest-500 pl-3 py-2">
                <p className="font-semibold text-sm">वाढीचा काल</p>
                <p className="text-sm text-gray-600">गाठी तयार होताना नियमित पाणी आवश्यक</p>
              </div>
              <div className="border-l-4 border-forest-500 pl-3 py-2">
                <p className="font-semibold text-sm">काढणीपूर्वी</p>
                <p className="text-sm text-gray-600">10–15 दिवस पाणी थांबवा (कोरडेसाठी)</p>
              </div>
            </div>
          </InfoCard>
        </section>

        {/* 5. खत व्यवस्थापन */}
        <section>
          <h2 className="text-2xl font-display font-bold text-forest-900 mb-4">🌿 खत व्यवस्थापन</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <InfoCard title="जैविक खत" icon="♻️">
              <StatBox label="शेणखत" value="20–25 टन/हेक्टर" />
              <p className="text-sm text-gray-600 mt-3">लागवडीपूर्वी अच्छोद शेणखत मिळवा</p>
            </InfoCard>
            <InfoCard title="रासायनिक खत" icon="⚗️">
              <StatBox label="नत्र (N)" value="100 kg" />
              <StatBox label="स्फुरद (P)" value="50 kg" />
              <StatBox label="पालाश (K)" value="50 kg" />
              <p className="text-xs text-gray-600 mt-2">अर्धे नत्र लागवडीवेळी, उरलेले टप्प्याटप्प्याने द्या</p>
            </InfoCard>
          </div>
        </section>

        {/* 6. कीड व रोग नियंत्रण */}
        <section>
          <h2 className="text-2xl font-display font-bold text-forest-900 mb-4">🐛 कीड व रोग नियंत्रण (प्रारंभिक उपाय)</h2>
          <InfoCard title="सुरक्षा उपाय" icon="🛡️">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-forest-600 font-bold">✓</span>
                <span className="text-sm">नियमित निरीक्षण करा (सप्ताहातून एक वेळ)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-forest-600 font-bold">✓</span>
                <span className="text-sm">पान करपा, भुरी, अळी यावर योग्य फवारणी करा</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-forest-600 font-bold">✓</span>
                <span className="text-sm">गरजेनुसार कीटकनाशके आणि बुरशीनाशके वापरा</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-forest-600 font-bold">✓</span>
                <span className="text-sm">संक्रमित पाने आणि झाडे लगेच काढून टाका</span>
              </li>
            </ul>
          </InfoCard>
        </section>

        {/* 7. काढणी */}
        <section>
          <h2 className="text-2xl font-display font-bold text-forest-900 mb-4">🌾 काढणी (Harvesting)</h2>
          <InfoCard title="काढणीची प्रक्रिया" icon="✂️">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-xl">📋</span>
                <div>
                  <p className="font-semibold text-sm">कधी करायचे</p>
                  <p className="text-sm text-gray-600">पाने वाळायला लागली की काढणी करा (सामान्यतः 150-170 दिवस)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🌞</span>
                <div>
                  <p className="font-semibold text-sm">काढणीनंतर</p>
                  <p className="text-sm text-gray-600">सावलीत कमीतकमी 2-3 आठवडे वाळवा</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">💾</span>
                <div>
                  <p className="font-semibold text-sm">साठवणूकीपूर्वी</p>
                  <p className="text-sm text-gray-600">पूर्ण कोरडे करा (नैसर्गिक रंग येऊ द्या)</p>
                </div>
              </div>
            </div>
          </InfoCard>
        </section>

        {/* 8. साठवणूक */}
        <section>
          <h2 className="text-2xl font-display font-bold text-forest-900 mb-4">📦 साठवणूक</h2>
          <InfoCard title="साठवणुकीची परिस्थिती" icon="🏚️">
            <div className="grid sm:grid-cols-3 gap-3">
              <StatBox label="तापमान" value="10-15°C" />
              <StatBox label="ओलावा" value="60-70%" />
              <StatBox label="वेंटिलेशन" value="उच्च" />
            </div>
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-900">
                <strong>⚠️ महत्वाचे:</strong> जाळीच्या पिशव्या वापरा, नेहमी हवा चलत ठेवा, ओलावा टाळा (सड टाळण्यासाठी)
              </p>
            </div>
          </InfoCard>
        </section>

        {/* 9. उत्पादन व नफा */}
        <section>
          <h2 className="text-2xl font-display font-bold text-forest-900 mb-4">💰 उत्पादन व नफा</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <InfoCard title="उत्पादन क्षमता" icon="📊">
              <StatBox label="सरासरी उत्पादन" value="200–300 क्विंटल/हेक्टर" />
              <p className="text-sm text-gray-600 mt-3">योग्य व्यवस्थापन केल्यास उत्पादन वाढते</p>
            </InfoCard>
            <InfoCard title="बाजारभाव" icon="💹">
              <p className="text-sm text-gray-700">
                योग्य व्यवस्थापन केल्यास <strong>चांगला बाजारभाव</strong> मिळतो. शहरातील मंडी आणि निर्यात बाजार उपलब्ध.
              </p>
            </InfoCard>
          </div>
        </section>

        {/* 10. महत्वाचे सल्ले */}
        <section>
          <h2 className="text-2xl font-display font-bold text-forest-900 mb-4">⚠️ महत्वाचे सल्ले</h2>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-orange-200 rounded-2xl p-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🚫</span>
                <span className="text-sm">रोगग्रस्त झाडे लगेच काढा आणि नष्ट करा</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">💧</span>
                <span className="text-sm">पाणी साचू देऊ नका (फंगल रोगांसाठी)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">⚗️</span>
                <span className="text-sm">संतुलित खत वापरा (जास्त नत्र टाळा)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">👨‍🌾</span>
                <span className="text-sm">नियमित कृषी तज्ञांचा सल्ला घ्या</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🔄</span>
                <span className="text-sm">पीक फेरपालट करा (3-4 वर्षे अंतर)</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 11. रोग व उपचार */}
        <section>
          <h2 className="text-2xl font-display font-bold text-forest-900 mb-6">🦠 कांदा पिकातील रोग व उपचार</h2>
          <div className="space-y-4">
            {diseases.map((disease, idx) => (
              <div key={idx} onClick={() => setExpandedDisease(expandedDisease === idx ? null : idx)} className="cursor-pointer">
                <DiseaseItem {...disease} />
              </div>
            ))}
          </div>
        </section>

        {/* Contact suggestion */}
        <section className="bg-white rounded-2xl border-2 border-forest-200 p-8 text-center">
          <h3 className="text-xl font-display font-bold text-forest-900 mb-3">📞 अजून माहितीसाठी</h3>
          <p className="text-gray-700 mb-4">
            आपल्या स्थानिक कृषी विभाग किंवा AgroVision AI Chat वापरून तज्ञांचा सल्ला घ्या.
          </p>
          <a href="/chat" className="inline-flex items-center gap-2 bg-forest-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-forest-700 transition-colors">
            💬 AI सहाय्यकला विचारा
          </a>
        </section>

      </div>
    </div>
  );
};

export default OnionInfo;
