/**
 * Loader.jsx — Animated scan indicator with Marathi language
 */
import React from 'react';

const Loader = ({ message = 'पानाचे विश्लेषण करत आहे…', sub = 'AI मॉडल रोगाची खोज करत आहे' }) => (
  <div className="flex flex-col items-center justify-center gap-5 py-8 animate-fade-in">
    <div className="relative flex items-center justify-center">
      <span className="absolute inline-flex h-20 w-20 rounded-full bg-forest-400 opacity-20 animate-ping" />
      <svg className="absolute w-20 h-20 animate-spin-slow" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="40" cy="40" r="36" stroke="#2da42d" strokeWidth="1.5" strokeDasharray="7 5" strokeLinecap="round"/>
      </svg>
      <div className="z-10 w-12 h-12 bg-forest-600 rounded-full flex items-center justify-center shadow-green-glow">
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12 2C6 2 3 8 3 12c0 4.5 3 8 9 8s9-3.5 9-8c0-4-3-8-9-8z" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.2" strokeLinejoin="round"/>
          <path d="M12 20V10M12 10C9 8 6 9 4 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
    <div className="text-center space-y-1">
      <p className="text-forest-800 font-sans font-semibold text-sm">{message}</p>
      <p className="text-forest-500 font-sans text-xs">{sub}</p>
    </div>
    <div className="flex items-center gap-2">
      {[0,1,2,3].map(i => (
        <span key={i} className="w-1.5 h-1.5 rounded-full bg-forest-500 animate-bounce" style={{ animationDelay: `${i*120}ms` }} />
      ))}
    </div>
  </div>
);

export default Loader;