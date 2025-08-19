import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: {
    background: string;
    surface: string;
    primary: string;
    text: string;
    textSecondary: string;
    border: string;
    card: string;
    success: string;
    warning: string;
    error: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const lightColors = {
  background: '#f8fafc',
  surface: '#ffffff',
  primary: '#1e40af',
  text: '#1f2937',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  card: '#ffffff',
  success: '#059669',
  warning: '#f59e0b',
  error: '#dc2626',
};

const darkColors = {
  background: '#0f172a',
  surface: '#1e293b',
  primary: '#3b82f6',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  border: '#334155',
  card: '#1e293b',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    setIsDark(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}