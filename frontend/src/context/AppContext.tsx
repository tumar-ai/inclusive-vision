import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type Lang = 'ru' | 'kz';
type FontSize = 'normal' | 'large' | 'xlarge';

interface AppContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  highContrast: boolean;
  toggleContrast: () => void;
  fontSize: FontSize;
  cycleFontSize: () => void;
  t: (ru: string, kz: string) => string;
  speak: (text: string) => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('iv_lang') as Lang) || 'ru');
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('iv_hc') === 'true');
  const [fontSize, setFontSize] = useState<FontSize>(() => (localStorage.getItem('iv_fs') as FontSize) || 'normal');

  useEffect(() => {
    localStorage.setItem('iv_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('iv_hc', String(highContrast));
    document.body.classList.toggle('high-contrast', highContrast);
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('iv_fs', fontSize);
    document.body.classList.remove('font-large', 'font-xlarge');
    if (fontSize !== 'normal') document.body.classList.add(`font-${fontSize}`);
  }, [fontSize]);

  const toggleContrast = () => setHighContrast(p => !p);

  const cycleFontSize = () => {
    setFontSize(p => p === 'normal' ? 'large' : p === 'large' ? 'xlarge' : 'normal');
  };

  const t = (ru: string, kz: string) => lang === 'kz' ? kz : ru;

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang === 'kz' ? 'kk-KZ' : 'ru-RU';
      utter.rate = 0.9;
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <AppContext.Provider value={{ lang, setLang, highContrast, toggleContrast, fontSize, cycleFontSize, t, speak }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
