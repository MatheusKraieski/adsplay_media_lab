
import React, { useState } from 'react';
import { Page } from './types';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import VideoAdCreatorPage from './pages/VideoAdCreatorPage';
import SliderAdCreatorPage from './pages/SliderAdCreatorPage';
import VideoDisplayAdCreatorPage from './pages/SoccerAdCreatorPage';
import CarouselAdCreatorPage from './pages/CarouselAdCreatorPage';
import { LanguageProvider } from './contexts/LanguageContext';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);

  const handleSelectProject = (page: Page) => {
    setCurrentPage(page);
  };

  const handleBackToHome = () => {
    setCurrentPage(Page.Home);
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.VideoAd:
        return <VideoAdCreatorPage onBack={handleBackToHome} />;
      case Page.SliderAd:
        return <SliderAdCreatorPage onBack={handleBackToHome} />;
      case Page.VideoDisplayAd:
        return <VideoDisplayAdCreatorPage onBack={handleBackToHome} />;
      case Page.CarouselAd:
        return <CarouselAdCreatorPage onBack={handleBackToHome} />;
      case Page.Home:
      default:
        return <HomePage onSelectProject={handleSelectProject} />;
    }
  };

  return (
    <LanguageProvider>
      <div className="bg-gray-900 text-white min-h-screen">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8">
          {renderPage()}
        </main>
      </div>
    </LanguageProvider>
  );
};

export default App;