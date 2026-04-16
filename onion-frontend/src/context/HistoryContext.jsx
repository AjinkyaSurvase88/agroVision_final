import { createContext, useContext } from 'react';

export const HistoryContext = createContext({
  history: [],
  addHistoryEntry: () => {},
  clearHistory: () => {},
});

export const useHistory = () => useContext(HistoryContext);