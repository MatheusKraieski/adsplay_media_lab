import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CarouselAdData } from '../types';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface CarouselPreviewProps {
  adData: CarouselAdData;
}

const CarouselPreview: React.FC<CarouselPreviewProps> = ({ adData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Fix: Use ReturnType<typeof setTimeout> for browser compatibility instead of NodeJS.Timeout
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getPreviewSize = useCallback(() => {
    const [width, height] = adData.size.split('x').map(Number);
    return { width, height };
  }, [adData.size]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % adData.slides.length);
  }, [adData.slides.length]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + adData.slides.length) % adData.slides.length);
  };
  
  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  useEffect(() => {
    if (adData.autoPlay) {
      resetTimer();
      timerRef.current = setTimeout(goToNext, adData.playDuration * 1000);
    }
    return resetTimer;
  }, [currentIndex, adData.autoPlay, adData.playDuration, goToNext, resetTimer]);

  const { width, height } = getPreviewSize();
  const currentSlide = adData.slides[currentIndex];

  const handlePrevClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    goToPrev();
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    goToNext();
  };

  return (
    <div
      className="relative overflow-hidden bg-black shadow-lg select-none"
      style={{ width, height }}
    >
      <a href={currentSlide?.destinationUrl || '#'} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
        {/* Slides Container */}
        <div className="w-full h-full relative">
          {adData.slides.map((slide, index) => (
            <div
              key={slide.id}
              className="absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out"
              style={{ opacity: index === currentIndex ? 1 : 0, zIndex: index === currentIndex ? 1 : 0 }}
            >
              <img src={slide.image} alt={slide.headline} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none z-10 text-white">
          <div className="mb-2">
            <h3 className="font-bold text-lg leading-tight">{currentSlide?.headline}</h3>
            <p className="text-sm text-gray-200">{currentSlide?.caption}</p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center space-x-2">
              {adData.slides.map((_, index) => (
                <div key={index} className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}></div>
              ))}
            </div>
            <div
              className="px-4 py-2 rounded-md text-sm font-bold pointer-events-auto"
              style={{ backgroundColor: adData.ctaBgColor, color: adData.ctaColor }}
            >
              {adData.ctaText}
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        {adData.autoPlay && (
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-500/50 z-20">
                <div
                    key={currentIndex} // Reset animation on slide change
                    className="h-full"
                    style={{ 
                        backgroundColor: adData.progressBarColor,
                        animation: `progress ${adData.playDuration}s linear forwards`,
                    }}
                ></div>
                <style>{`
                    @keyframes progress {
                        from { width: 0%; }
                        to { width: 100%; }
                    }
                `}</style>
            </div>
        )}

        {/* Navigation */}
        <button
          onClick={handlePrevClick}
          className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-1 z-20 transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <button
          onClick={handleNextClick}
          className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-1 z-20 transition-colors"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </a>
    </div>
  );
};

export default CarouselPreview;
