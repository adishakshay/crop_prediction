// src/contexts/LanguageContext.js
import { createContext, useState, useEffect } from "react";

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  // ✅ Persist in localStorage so it stays after refresh
  useEffect(() => {
    const storedLang = localStorage.getItem("lang");
    if (storedLang) {
      setLang(storedLang);
    }
  }, []);

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang }}>
      {children}
    </LanguageContext.Provider>
  );
}
