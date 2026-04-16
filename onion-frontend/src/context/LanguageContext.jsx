import React, { createContext, useState, useCallback } from 'react';
import marathiTranslations from '../translations/marathi.json';

// Create context
export const LanguageContext = createContext();

// Translations object
const translations = {
  marathi: marathiTranslations,
  english: {}, // Will use default English in code
};

// Provider component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('marathi'); // Default to Marathi

  const t = useCallback((key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (let k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if not found
      }
    }
    
    return value || key;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(lang => lang === 'marathi' ? 'english' : 'marathi');
  };

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use translations
export const useTranslation = () => {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within LanguageProvider');
  }
  return context;
};
