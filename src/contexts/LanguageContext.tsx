import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from '../localization/en';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define supported languages
type Language = 'en' | 'ar' | 'fr' | 'ta'; // Add more as needed

// Define translations type
type Translations = typeof en;

// Language context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
  translations: Translations;
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Storage key
const LANGUAGE_STORAGE_KEY = '@app_language';

// Translation helper function - navigates nested object with dot notation
const getNestedValue = (obj: any, path: string): string => {
  const keys = path.split('.');
  let value = obj;
  
  for (const key of keys) {
    if (value === null || value === undefined) {
      return path; // Return key if translation not found
    }
    value = value[key];
  }
  
  return typeof value === 'string' ? value : path; // Return key if not a string
};

// Language Provider Component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translations>(en);

  // Load saved language on mount
  useEffect(() => {
    loadLanguage();
  }, []);

  // Load language from storage
  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && ['en', 'ar', 'fr', 'ta'].includes(savedLanguage)) {
        setLanguageState(savedLanguage as Language);
        // For now, only English is implemented
        // In the future, load other languages here
        if (savedLanguage === 'en') {
          setTranslations(en);
        }
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  // Change language
  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      setLanguageState(lang);
      // For now, only English is implemented
      // In the future, load other languages here
      if (lang === 'en') {
        setTranslations(en);
      }
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  // Translation function
  const t = (key: string): string => {
    return getNestedValue(translations, key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

// Export default for convenience
export default LanguageContext;




