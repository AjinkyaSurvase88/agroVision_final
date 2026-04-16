/**
 * History.jsx — Prediction history cards
 */
import React, { useState } from 'react';
import { useHistory } from '../context/HistoryContext';

const isHealthy = d => /healthy|normal|good/i.test(d);
const toPct     = c => Math.round(c > 1 ? c : c * 100);

const HistoryCard = ({ entry, index }) => {
  const healthy = isHealthy(entry.disease);
  const pct     = toPct(entry.confidence);
  return (
    <div
      className="flex items-center gap-3 bg-white rounded-2xl border border-forest-100 p-3.5 hover:border-forest-300 hover:shadow-card-hover transition-all duration-200 animate-fade-up group"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-forest-50">
        {entry.preview
          ? <img src={entry.preview} alt={entry.disease} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-2xl">🌿</div>
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${healthy ? 'bg-forest-500' : 'bg-red-500'}`} />
          <p className="text-sm font-sans font-semibold text-gray-800 truncate">{entry.disease}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Mini bar */}
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[80px]">
            <div className={`h-full rounded-full ${healthy ? 'bg-forest-500' : 'bg-red-400'}`} style={{ width: `${pct}%` }} />
          </div>
          <span className={`text-xs font-mono font-bold ${healthy ? 'text-forest-600' : 'text-red-500'}`}>{pct}%</span>
        </div>
        <p className="text-[11px] font-sans text-gray-400 mt-0.5 truncate">{entry.filename} · {entry.date}</p>
      </div>

      {/* Status chip */}
      <div className={`flex-shrink-0 text-[10px] font-sans font-semibold px-2 py-1 rounded-full ${healthy ? 'bg-healthy-light text-healthy-dark' : 'bg-disease-light text-disease-dark'}`}>
        {healthy ? 'Healthy' : 'Disease'}
      </div>
    </div>
  );
};

const History = ({ maxItems }) => {
  const { history, clearHistory } = useHistory();
  const [showAll, setShowAll] = useState(false);

  const items = maxItems && !showAll ? history.slice(0, maxItems) : history;
  const hasMore = maxItems && history.length > maxItems && !showAll;

  if (!history.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center bg-white rounded-2xl border border-forest-100">
        <div className="w-12 h-12 bg-forest-50 rounded-2xl flex items-center justify-center text-2xl mb-3">📋</div>
        <p className="font-sans font-semibold text-gray-600 text-sm">No predictions yet</p>
        <p className="text-xs text-gray-400 mt-1">Upload a leaf image to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-gray-400">
          {history.length} prediction{history.length !== 1 ? 's' : ''}
        </p>
        <button onClick={clearHistory}
          className="text-xs font-sans text-red-400 hover:text-red-600 transition-colors flex items-center gap-1">
          <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4h12M5 4V2.5a.5.5 0 01.5-.5h5a.5.5 0 01.5.5V4M6 7v4M10 7v4M3 4l.867 9.143A1 1 0 004.86 14h6.28a1 1 0 00.994-.857L13 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Clear all
        </button>
      </div>

      <div className="space-y-2">
        {items.map((e, i) => <HistoryCard key={e.id || i} entry={e} index={i} />)}
      </div>

      {hasMore && (
        <button onClick={() => setShowAll(true)}
          className="w-full py-2.5 text-xs font-sans font-semibold text-forest-600 bg-forest-50 hover:bg-forest-100 border border-forest-200 rounded-xl transition-all">
          Show {history.length - maxItems} more…
        </button>
      )}
    </div>
  );
};

export default History;