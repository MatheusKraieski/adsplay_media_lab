import React from 'react';
import { SettingsIcon } from './icons/SettingsIcon';
import { useLanguage } from '../contexts/LanguageContext';

const Header: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const getButtonClass = (lang: 'en' | 'pt') => {
    const baseClass = "px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-300";
    if (language === lang) {
      return `${baseClass} text-white bg-purple-500`;
    }
    return `${baseClass} text-gray-400 hover:text-white`;
  };

  return (
    <header className="py-6 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          ADSPLAY <span className="text-purple-500">MEDIA LAB</span>
        </h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-gray-800 rounded-full p-1">
            <button onClick={() => setLanguage('en')} className={getButtonClass('en')}>EN</button>
            <button onClick={() => setLanguage('pt')} className={getButtonClass('pt')}>PT</button>
          </div>
          <button className="text-gray-400 hover:text-white transition-colors">
            <SettingsIcon />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
