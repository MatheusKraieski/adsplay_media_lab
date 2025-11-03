import React, { useState } from 'react';
import { CarouselAdData, CarouselSlide } from '../types';
import CarouselAdForm from '../components/CarouselAdForm';
import CarouselPreview from '../components/CarouselPreview';
import { useLanguage } from '../contexts/LanguageContext';
import { exportCarouselAd } from '../services/exportService';

interface CarouselAdCreatorPageProps {
  onBack: () => void;
}

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const newId = () => `slide-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

const CarouselAdCreatorPage: React.FC<CarouselAdCreatorPageProps> = ({ onBack }) => {
  const { t } = useLanguage();

  const [adData, setAdData] = useState<CarouselAdData>({
    size: '300x250',
    slides: [
      { id: newId(), image: 'https://storage.googleapis.com/adsplay-media-lab-assets/carousel-1.png', headline: 'Discover Our New Collection', caption: 'Stylish and comfortable.', destinationUrl: 'https://google.com?q=1' },
      { id: newId(), image: 'https://storage.googleapis.com/adsplay-media-lab-assets/carousel-2.png', headline: 'Built to Last', caption: 'High-quality materials.', destinationUrl: 'https://google.com?q=2' },
      { id: newId(), image: 'https://storage.googleapis.com/adsplay-media-lab-assets/carousel-3.png', headline: 'Shop Now and Save', caption: 'Limited time offer.', destinationUrl: 'https://google.com?q=3' },
    ],
    ctaText: 'Learn More',
    ctaColor: '#FFFFFF',
    ctaBgColor: '#8A2BE2',
    progressBarColor: '#FFFFFF',
    autoPlay: true,
    playDuration: 5,
  });

  const updateAdData = (field: keyof CarouselAdData, value: any) => {
    setAdData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleExport = () => {
    exportCarouselAd(adData);
  };

  const handleUpdateSlide = (id: string, field: keyof CarouselSlide, value: any) => {
    const newSlides = adData.slides.map(slide => 
      slide.id === id ? { ...slide, [field]: value } : slide
    );
    updateAdData('slides', newSlides);
  }

  const handleAddSlide = () => {
    const newSlide: CarouselSlide = {
        id: newId(),
        image: 'https://storage.googleapis.com/adsplay-media-lab-assets/placeholder.png',
        headline: 'New Slide Headline',
        caption: 'New slide caption.',
        destinationUrl: 'https://google.com'
    };
    updateAdData('slides', [...adData.slides, newSlide]);
  }

  const handleDeleteSlide = (id: string) => {
    if (adData.slides.length > 1) {
        updateAdData('slides', adData.slides.filter(slide => slide.id !== id));
    }
  }
  
  const handleImageUpload = async (id: string, file: File) => {
    const dataUrl = await fileToDataUrl(file);
    handleUpdateSlide(id, 'image', dataUrl);
  };

  return (
    <div>
      <button onClick={onBack} className="text-gray-400 hover:text-white mb-6">
        &larr; {t('common.backToProjects')}
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 max-h-[calc(100vh-9rem)] overflow-y-auto pr-2 custom-scrollbar">
          <CarouselAdForm
            adData={adData}
            updateAdData={updateAdData}
            onExport={handleExport}
            onAddSlide={handleAddSlide}
            onDeleteSlide={handleDeleteSlide}
            onUpdateSlide={handleUpdateSlide}
            onImageUpload={handleImageUpload}
          />
        </div>
        <div className="lg:col-span-2 flex justify-center items-start">
          <CarouselPreview adData={adData} />
        </div>
      </div>
    </div>
  );
};

export default CarouselAdCreatorPage;