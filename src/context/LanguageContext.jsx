import React, { createContext, useContext, useEffect, useState } from "react";
import { translations } from "../i18n/translations";

const STORAGE_KEY = "nbe-lang";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "en" ? "en" : "ar";
  });

  const isRtl = language === "ar";
  const dir = isRtl ? "rtl" : "ltr";

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  const setLanguage = (lang) => {
    setLanguageState(lang === "en" ? "en" : "ar");
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === "ar" ? "en" : "ar"));
  };

  const t = (key) => translations[language][key] ?? key;

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, toggleLanguage, t, dir, isRtl }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
