/**
 * App.js — AgroVision v2
 * Root: provides global history context and routes.
 */

import React, { useState, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';
import OnionInfo from './pages/OnionInfo';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { HistoryContext } from './context/HistoryContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  // Global prediction history — shared across pages
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('agrovision_history') || '[]');
    } catch {
      return [];
    }
  });

  const addHistoryEntry = useCallback((entry) => {
    setHistory(prev => {
      const updated = [entry, ...prev].slice(0, 50); // keep last 50
      localStorage.setItem('agrovision_history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('agrovision_history');
  }, []);

  return (
    <AuthProvider>
      <LanguageProvider>
        <HistoryContext.Provider value={{ history, addHistoryEntry, clearHistory }}>
          <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-highlight-50 flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/"          element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/chat"      element={<ChatPage />} />
                <Route path="/onion-info" element={<OnionInfo />} />
                <Route path="/login"     element={<Login />} />
                <Route path="/signup"    element={<Signup />} />
                <Route path="*"          element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </HistoryContext.Provider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
