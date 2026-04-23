/**
 * Dashboard.jsx — AgroVision v2
 * Overview grid: stats, scan, weather, chatbot, history
 */
import React, { useState, useMemo } from 'react';
import { useHistory } from '../context/HistoryContext';
import Upload from '../components/Upload';
import Result from '../components/Result';
import WeatherCard from '../components/WeatherCard';
import Chatbot from '../components/Chatbot';
import History from '../components/History';

// ── Stat card ─────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, iconBg, trend, delay }) => (
  <div className={`bg-white rounded-2xl border border-forest-100 shadow-card p-4
    hover:shadow-card-hover transition-all duration-200 animate-fade-up`}
    style={{ animationDelay: delay }}>
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${iconBg}`}>
        {icon}
      </div>
      {trend !== undefined && (
        <span className={`text-[10px] font-mono font-semibold px-2 py-1 rounded-full
          ${trend >= 0 ? 'bg-healthy-light text-healthy-dark' : 'bg-disease-light text-disease-dark'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <p className="font-display text-2xl sm:text-3xl font-bold text-gray-800 animate-count-up">{value}</p>
    <p className="text-xs font-sans text-gray-400 mt-0.5">{label}</p>
  </div>
);

// ── Section header ────────────────────────────────────────────────
const SectionHeader = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-8 h-8 bg-forest-100 text-forest-600 rounded-xl
      flex items-center justify-center text-base flex-shrink-0">
      {icon}
    </div>
    <div>
      <h2 className="font-display font-bold text-forest-900 text-base leading-tight">{title}</h2>
      {subtitle && <p className="text-xs font-sans text-gray-400">{subtitle}</p>}
    </div>
  </div>
);

// ── Mini donut chart (pure SVG, no lib) ───────────────────────────
const DonutChart = ({ diseased, healthy, total }) => {
  const r  = 28;
  const cx = 36;
  const cy = 36;
  const circ = 2 * Math.PI * r;
  const healthyPct  = total > 0 ? healthy  / total : 0;
  const diseasedPct = total > 0 ? diseased / total : 0;
  const healthyDash  = healthyPct  * circ;
  const diseasedDash = diseasedPct * circ;
  const healthyOffset  = 0;
  const diseasedOffset = -(healthyDash);

  return (
    <div className="flex items-center gap-4">
      <svg width="72" height="72" viewBox="0 0 72 72" aria-label={`${healthy} healthy, ${diseased} diseased`}>
        {/* Background track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth="9" />
        {/* Healthy arc */}
        {healthy > 0 && (
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2da42d" strokeWidth="9"
            strokeDasharray={`${healthyDash} ${circ}`}
            strokeDashoffset={healthyOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`} />
        )}
        {/* Diseased arc */}
        {diseased > 0 && (
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ef4444" strokeWidth="9"
            strokeDasharray={`${diseasedDash} ${circ}`}
            strokeDashoffset={diseasedOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`} />
        )}
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
          className="font-display font-bold" style={{ fontSize: 16, fill: '#134514' }}>
          {total}
        </text>
      </svg>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-sans">
          <span className="w-2.5 h-2.5 rounded-full bg-forest-500 flex-shrink-0" />
          <span className="text-gray-600">Healthy <strong>{healthy}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-xs font-sans">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 flex-shrink-0" />
          <span className="text-gray-600">Diseased <strong>{diseased}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-xs font-sans">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-200 flex-shrink-0" />
          <span className="text-gray-400">Total scans: {total}</span>
        </div>
      </div>
    </div>
  );
};

// ── Disease breakdown bar ─────────────────────────────────────────
const DiseaseBar = ({ name, count, total, color }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-sans text-gray-600 truncate max-w-[160px]">{name}</span>
        <span className="text-xs font-mono font-bold text-gray-500 ml-2">{count}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [result,  setResult]  = useState(null);
  const [preview, setPreview] = useState(null);
  const { history, addHistoryEntry } = useHistory();

  // ── Derived stats ──────────────────────────────────────────────
  const stats = useMemo(() => {
    const total    = history.length;
    const diseased = history.filter(h => !/healthy|normal|good/i.test(h.disease)).length;
    const healthy  = total - diseased;
    const avgConf  = total > 0
      ? Math.round(history.reduce((s, h) => s + (h.confidence > 1 ? h.confidence : h.confidence * 100), 0) / total)
      : 0;
    return { total, diseased, healthy, avgConf };
  }, [history]);

  // Disease frequency breakdown
  const diseaseFreq = useMemo(() => {
    const counts = {};
    history.forEach(h => { counts[h.disease] = (counts[h.disease] || 0) + 1; });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [history]);

  const COLORS = ['bg-red-400','bg-amber-400','bg-sky-400','bg-purple-400','bg-forest-400'];

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
    setTimeout(() => {
      document.getElementById('dash-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 page-enter">

      {/* Page title */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-forest-900">
            Dashboard
          </h1>
          <p className="text-sm font-sans text-gray-400 mt-1">
            Smart agriculture overview · {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        {/* Live indicator */}
        <span className="flex items-center gap-1.5 text-xs font-sans font-medium text-forest-700
          bg-forest-50 border border-forest-200 rounded-full px-3 py-1.5 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-forest-500 animate-pulse" />
          Live
        </span>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total Scans"    value={stats.total}    icon="🔬" iconBg="bg-forest-50"  delay="0ms"   />
        <StatCard label="Diseases Found" value={stats.diseased} icon="⚠️" iconBg="bg-red-50"     delay="60ms"  />
        <StatCard label="Healthy Crops"  value={stats.healthy}  icon="✅" iconBg="bg-green-50"   delay="120ms" />
        <StatCard label="Avg Confidence" value={stats.total > 0 ? `${stats.avgConf}%` : '—'}
          icon="🎯" iconBg="bg-sky-50" delay="180ms" />
      </div>

      {/* ── Main grid ── */}
      <div className="grid xl:grid-cols-3 gap-5">

        {/* ─ Left / Centre column ─ */}
        <div className="xl:col-span-2 space-y-5">

          {/* Scan panel */}
          <div className="bg-white rounded-2xl border border-forest-100 shadow-card overflow-hidden
            animate-fade-up delay-100">
            <div className="bg-gradient-to-r from-forest-50 to-white border-b border-forest-100
              px-5 py-4">
              <SectionHeader icon="🔍" title="Scan New Image"
                subtitle="Upload a leaf photo for instant disease detection" />
            </div>
            <div className="p-5">
              <Upload onResult={handleResult} />
              {result && (
                <div id="dash-result" className="mt-5 pt-5 border-t border-forest-100">
                  <Result result={result} onReset={() => { setResult(null); setPreview(null); }} />
                </div>
              )}
            </div>
          </div>

          {/* Analytics panel */}
          <div className="bg-white rounded-2xl border border-forest-100 shadow-card overflow-hidden
            animate-fade-up delay-200">
            <div className="border-b border-forest-100 px-5 py-4">
              <SectionHeader icon="📊" title="Scan Analytics"
                subtitle={`Based on ${stats.total} prediction${stats.total !== 1 ? 's' : ''}`} />
            </div>
            <div className="p-5">
              {stats.total === 0 ? (
                <div className="text-center py-8">
                  <p className="text-3xl mb-2">📈</p>
                  <p className="text-sm font-sans text-gray-400">
                    No data yet — run your first scan to see analytics.
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Donut */}
                  <div>
                    <p className="text-[10px] font-mono font-semibold uppercase tracking-widest
                      text-gray-400 mb-3">Health Overview</p>
                    <DonutChart
                      diseased={stats.diseased}
                      healthy={stats.healthy}
                      total={stats.total}
                    />
                  </div>
                  {/* Frequency */}
                  <div>
                    <p className="text-[10px] font-mono font-semibold uppercase tracking-widest
                      text-gray-400 mb-3">Top Detections</p>
                    <div className="space-y-3">
                      {diseaseFreq.map(([name, count], i) => (
                        <DiseaseBar key={name} name={name} count={count}
                          total={stats.total} color={COLORS[i % COLORS.length]} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* History panel */}
          <div className="bg-white rounded-2xl border border-forest-100 shadow-card overflow-hidden
            animate-fade-up delay-300">
            <div className="border-b border-forest-100 px-5 py-4">
              <SectionHeader icon="📋" title="Prediction History"
                subtitle="Your recent disease scans" />
            </div>
            <div className="p-5">
              <History maxItems={6} />
            </div>
          </div>

        </div>

        {/* ─ Right sidebar ─ */}
        <div className="space-y-5">

          {/* Weather */}
          <div className="animate-fade-up delay-100">
            <p className="text-[10px] font-mono font-semibold uppercase tracking-widest
              text-gray-400 mb-3">Local Weather</p>
            <WeatherCard defaultCity="Solapur" />
          </div>

          {/* AI Chat */}
          <div className="animate-fade-up delay-200">
            <p className="text-[10px] font-mono font-semibold uppercase tracking-widest
              text-gray-400 mb-3">AI Assistant</p>
            <Chatbot compact={true} />
          </div>

          {/* Quick tips card */}
          <div className="bg-gradient-to-br from-forest-800 to-forest-950 rounded-2xl p-5
            text-white animate-fade-up delay-300 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/5 rounded-full" />
            <div className="absolute bottom-2 -left-3 w-14 h-14 bg-white/5 rounded-full" />
            <div className="relative z-10">
              <p className="text-xs font-mono font-semibold uppercase tracking-widest
                text-forest-300 mb-3">💡 Pro Tips</p>
              <ul className="space-y-2.5">
                {[
                  'Upload images in bright, natural light for best accuracy.',
                  'Confidence above 85% is highly reliable for field decisions.',
                  'Check weather before applying fungicides — avoid rain windows.',
                  'Use the chat assistant for treatment recommendations.',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs font-sans text-white/80 leading-relaxed">
                    <span className="text-forest-400 font-bold flex-shrink-0 mt-0.5">{i + 1}.</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;