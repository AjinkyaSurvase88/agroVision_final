/**
 * Home.jsx — AgroVision v2 Landing Page
 * Hero section + upload panel + result + weather sidebar
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from '../context/HistoryContext';
import Upload from '../components/Upload';
import Result from '../components/Result';
import WeatherCard from '../components/WeatherCard';

// ── Decorative SVG leaf ───────────────────────────────────────────
const LeafDecor = ({ className }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"
    className={className} aria-hidden="true">
    <path d="M60 10C30 10 10 40 10 65c0 30 20 50 50 50 10 0 22-3 31-9C107 95 120 75 120 52 120 25 95 10 60 10z"
      fill="currentColor" fillOpacity="0.12"/>
    <path d="M60 110V55M60 55C42 42 20 48 10 65"
      stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

// ── Feature badge ─────────────────────────────────────────────────
const Badge = ({ icon, text }) => (
  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3.5 py-1.5">
    <span className="text-sm" aria-hidden="true">{icon}</span>
    <span className="text-xs font-sans font-medium text-white/90">{text}</span>
  </div>
);

// ── Stat item ─────────────────────────────────────────────────────
const Stat = ({ value, label }) => (
  <div className="text-center">
    <p className="font-display text-3xl font-bold text-white">{value}</p>
    <p className="text-secondary-100 text-xs font-sans mt-0.5">{label}</p>
  </div>
);

// ── Photo tip ─────────────────────────────────────────────────────
const Tip = ({ text }) => (
  <li className="flex items-center gap-2 text-xs font-sans text-primary-700">
    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-accent-600 flex-shrink-0"
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    {text}
  </li>
);

const TIPS = [
  'Capture in natural daylight',
  'Fill the frame with the leaf',
  'Keep the image in sharp focus',
  'Avoid mud or water droplets',
];

// ─────────────────────────────────────────────────────────────────
const Home = () => {
  const [result,  setResult]  = useState(null);
  const [preview, setPreview] = useState(null);
  const { addHistoryEntry } = useHistory();

  const handleResult = (data, imgPreview, filename) => {
    setResult(data);
    setPreview(imgPreview);
    addHistoryEntry({
      id:         Date.now(),
      disease:    data.disease,
      confidence: data.confidence,
      preview:    imgPreview,
      filename:   filename || 'image.jpg',
      date:       new Date().toLocaleDateString(),
    });
    // Smooth scroll to result on mobile
    setTimeout(() => {
      document.getElementById('home-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleReset = () => { setResult(null); setPreview(null); };

  return (
    <div className="page-enter">

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-hero-gradient text-white">
        {/* Leaf decorations */}
        <LeafDecor className="absolute -top-6 -right-6 w-56 h-56 text-secondary-400 animate-float pointer-events-none" />
        <LeafDecor className="absolute bottom-0 -left-12 w-44 h-44 text-secondary-600 opacity-25 pointer-events-none"
          style={{ animationDelay: '1.6s' }} />

        {/* Leaf-pattern overlay */}
        <div className="absolute inset-0 bg-leaf-pattern opacity-30 pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 pt-12 pb-20 text-center">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20
            rounded-full px-4 py-1.5 mb-6 animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-300 animate-pulse" />
            <span className="text-xs font-mono font-semibold text-secondary-100 uppercase tracking-wider">
              AI Model Active
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight
            mb-5 animate-fade-up delay-100">
            AI-Powered Crop<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-200 to-highlight-300">
              Disease Detection
            </span>
          </h1>

          {/* Tagline */}
          <p className="font-sans text-secondary-100 text-base sm:text-lg max-w-lg mx-auto mb-8
            leading-relaxed animate-fade-up delay-200">
            Smart agriculture platform — detect onion diseases instantly, check local
            weather, and get AI-powered farming advice.
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12 animate-fade-up delay-300">
            <Badge icon="🔬" text="Instant diagnosis" />
            <Badge icon="🌿" text="Onion disease AI" />
            <Badge icon="🌦️" text="Weather insights" />
            <Badge icon="🤖" text="AI chat advisor" />
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-10 sm:gap-16 animate-fade-up delay-400">
            <Stat value="95%+" label="Model accuracy" />
            <div className="w-px h-10 bg-white/20" />
            <Stat value="<2s"  label="Analysis time"  />
            <div className="w-px h-10 bg-white/20" />
            <Stat value="6+"   label="Disease classes" />
          </div>
        </div>

        {/* Bottom wave */}
        <div className="-mb-px relative z-10">
          <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none" className="w-full h-10 sm:h-14" aria-hidden="true">
            <path d="M0 56V28C240 0 480 56 720 28 960 0 1200 56 1440 28V56H0z" fill="#f6fbf1"/>
          </svg>
        </div>
      </section>

      {/* ══ MAIN GRID ══════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Left: Upload + Result ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Upload card */}
            <div className="bg-white rounded-2xl border border-forest-100 shadow-card overflow-hidden
              animate-fade-up delay-100">
              {/* Card header */}
              <div className="bg-gradient-to-r from-forest-50 to-white border-b border-forest-100
                px-5 sm:px-6 py-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-forest-100 text-forest-600 rounded-xl
                  flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M3 9l7-7 7 7M5 8v8a1 1 0 001 1h3v-4h2v4h3a1 1 0 001-1V8"
                      stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h2 className="font-display font-bold text-forest-900 leading-tight">
                    Analyze Plant Image
                  </h2>
                  <p className="text-xs font-sans text-gray-400 mt-0.5">
                    Upload a clear leaf photo for instant AI diagnosis
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <Upload onResult={handleResult} />
              </div>

              {/* Tips footer */}
              <div className="bg-forest-50 border-t border-forest-100 px-5 sm:px-6 py-4">
                <p className="text-[10px] font-mono font-semibold uppercase tracking-widest
                  text-forest-600 mb-2">📷 Photo tips</p>
                <ul className="grid sm:grid-cols-2 gap-1.5">
                  {TIPS.map(t => <Tip key={t} text={t} />)}
                </ul>
              </div>
            </div>

            {/* Result */}
            {result && (
              <div id="home-result" className="animate-fade-up">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px flex-1 bg-forest-200" />
                  <span className="text-[10px] font-mono font-semibold text-forest-500 uppercase tracking-widest">
                    Detection Result
                  </span>
                  <div className="h-px flex-1 bg-forest-200" />
                </div>
                <Result result={result} onReset={handleReset} />
              </div>
            )}

            {/* Quick nav to other features */}
            <div className="grid sm:grid-cols-2 gap-4 animate-fade-up delay-200">
              <Link to="/dashboard"
                className="flex items-center gap-3 bg-white rounded-2xl border border-forest-100
                  p-4 hover:border-forest-400 hover:shadow-card-hover transition-all duration-200 group">
                <div className="w-10 h-10 bg-forest-100 rounded-xl flex items-center justify-center
                  text-forest-600 group-hover:bg-forest-600 group-hover:text-white transition-all flex-shrink-0">
                  <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="11" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="3" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="11" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </div>
                <div>
                  <p className="font-sans font-semibold text-gray-800 text-sm">Dashboard</p>
                  <p className="text-xs text-gray-400">Stats, history & full overview</p>
                </div>
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-gray-300 ml-auto
                  group-hover:text-forest-500 group-hover:translate-x-0.5 transition-all"
                  xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>

              <Link to="/chat"
                className="flex items-center gap-3 bg-white rounded-2xl border border-forest-100
                  p-4 hover:border-forest-400 hover:shadow-card-hover transition-all duration-200 group">
                <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center
                  text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all flex-shrink-0">
                  <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4h12a1 1 0 011 1v7a1 1 0 01-1 1H7l-4 3V5a1 1 0 011-1z"
                      stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="font-sans font-semibold text-gray-800 text-sm">AI Chat</p>
                  <p className="text-xs text-gray-400">Ask the agronomy assistant</p>
                </div>
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-gray-300 ml-auto
                  group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all"
                  xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* ── Right: Weather sidebar ── */}
          <div className="space-y-6 animate-fade-up delay-300">
            <div>
              <p className="text-[10px] font-mono font-semibold uppercase tracking-widest
                text-gray-400 mb-3">Local Weather</p>
              <WeatherCard defaultCity="Solapur" />
            </div>

            {/* Disease quick-ref */}
            <div className="bg-white rounded-2xl border border-forest-100 shadow-card overflow-hidden">
              <div className="bg-forest-50 border-b border-forest-100 px-4 py-3">
                <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-forest-600">
                  Common Onion Diseases
                </p>
              </div>
              <div className="p-3 space-y-2">
                {[
                  { name: 'Purple Blotch',      pathogen: 'Alternaria porri',       color: 'bg-purple-100 text-purple-700' },
                  { name: 'Stemphylium Blight',  pathogen: 'Stemphylium vesicarium', color: 'bg-amber-100 text-amber-700' },
                  { name: 'Downy Mildew',        pathogen: 'Peronospora destructor', color: 'bg-sky-100 text-sky-700' },
                  { name: 'Botrytis Leaf Blight',pathogen: 'Botrytis squamosa',     color: 'bg-red-100 text-red-700' },
                  { name: 'Healthy',             pathogen: 'No disease detected',    color: 'bg-green-100 text-green-700' },
                ].map(({ name, pathogen, color }) => (
                  <div key={name} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-forest-50 transition-colors">
                    <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded-lg flex-shrink-0 ${color}`}>
                      {name.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-sans font-semibold text-gray-700 truncate">{name}</p>
                      <p className="text-[10px] font-sans text-gray-400 italic truncate">{pathogen}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ══ FOOTER ════════════════════════════════════════════════ */}
      <footer className="text-center py-8 border-t border-forest-100 mt-4">
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <div className="w-6 h-6 bg-forest-700 rounded-md flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-white"
              xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 2C6 2 3 8 3 12c0 4.5 3 8 9 8s9-3.5 9-8c0-4-3-8-9-8z"
                stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.2"/>
            </svg>
          </div>
          <span className="font-display font-bold text-forest-800 text-sm">AgroVision v2</span>
        </div>
        <p className="text-xs font-sans text-gray-400">
          AI-powered smart agriculture platform ·{' '}
          <span className="text-forest-600 font-medium">Research use only</span>
        </p>
      </footer>

    </div>
  );
};

export default Home;