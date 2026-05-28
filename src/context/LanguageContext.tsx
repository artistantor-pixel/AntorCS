"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "../locales/en.json";
import bn from "../locales/bn.json";

type Language = "en" | "bn";
type Translations = typeof en;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Language>("en");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("app-lang") as Language;
    const initialLang = (savedLang && (savedLang === "en" || savedLang === "bn")) ? savedLang : "en";
    setLang(initialLang);
    document.documentElement.lang = initialLang;
    if (initialLang === "bn") {
      document.body.classList.add("font-bengali");
    } else {
      document.body.classList.remove("font-bengali");
    }
    setIsLoaded(true);
  }, []);

  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("app-lang", newLang);
    document.documentElement.lang = newLang;
    if (newLang === "bn") {
      document.body.classList.add("font-bengali");
    } else {
      document.body.classList.remove("font-bengali");
    }
  };

  // Simple nested key resolver, e.g., t('hero.title')
  const t = (key: string): string => {
    const dict = lang === "bn" ? bn : en;
    const keys = key.split(".");
    let current: any = dict;
    
    for (const k of keys) {
      if (current[k] === undefined) return key;
      current = current[k];
    }
    
    return typeof current === "string" ? current : key;
  };

  if (!isLoaded) return <div className="min-h-screen bg-background" />; // Prevent hydration mismatch

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
