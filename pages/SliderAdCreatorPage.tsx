
import React, { useState, useRef } from 'react';
import { SliderAdData } from '../types';
import SliderAdForm from '../components/SliderAdForm';
import SliderPreview from '../components/SliderPreview';
import { useLanguage } from '../contexts/LanguageContext';
import { exportSliderAd } from '../services/exportService';
import { exportGif } from '../services/gifService';

interface SliderAdCreatorPageProps {
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

const SliderAdCreatorPage: React.FC<SliderAdCreatorPageProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const adRef = useRef<HTMLDivElement>(null);

  const [adData, setAdData] = useState<SliderAdData>({
    size: '336x280',
    template: 'classic',
    beforeImage: 'https://storage.googleapis.com/adsplay-media-lab-assets/slider-before.png',
    afterImage: 'https://storage.googleapis.com/adsplay-media-lab-assets/slider-after.png',
    handleStyle: 'circle',
    handleThickness: 4,
    handleIcon: 'arrows',
    dividerColor: '#FFFFFF',
    dividerWidth: 4,
    showLabels: true,
    labelStyle: 'pill',
    beforeLabel: 'Before',
    afterLabel: 'After',
    labelBg: 'rgba(0, 0, 0, 0.7)',
    labelColor: '#FFFFFF',
    showCta: true,
    ctaText: 'Learn More',
    ctaStyle: 'solid',
    ctaBg: '#8A2BE2',
    ctaColor: '#FFFFFF',
    logoImage: 'https://storage.googleapis.com/adsplay-media-lab-assets/logo-placeholder.svg',
    logoPositionX: 15,
    logoPositionY: 15,
    logoZoom: 100,
    headline: 'Headline Text',
    caption: 'This is the caption for the ad.',
    fgColor: '#FFFFFF',
    startPositionPct: 50,
    hintAnimation: true,
    hintLoop: false,
    sweepDurationMs: 3000,
    beforeDestinationUrl: 'https://google.com?q=before',
    afterDestinationUrl: 'https://google.com?q=after',
    animateZoom: false,
    zoomLevel: 120,
    zoomDuration: 5,
  });

  const updateAdData = (field: keyof SliderAdData, value: any) => {
    setAdData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleExport = () => {
    exportSliderAd(adData);
  };

  const handleGifExport = async () => {
    if (adRef.current) {
        const [width, height] = adData.size.split('x').map(Number);
        const blob = await exportGif(adRef.current, width, height, (p) => console.log(`GIF export progress: ${p}`));
        if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `slider-demo.gif`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }
  }

  const handleImageUpload = async (field: 'beforeImage' | 'afterImage' | 'logoImage', file: File) => {
    try {
        const dataUrl = await fileToDataUrl(file);
        updateAdData(field, dataUrl);
    } catch (error) {
        console.error(`Failed to read file for ${field}`, error);
    }
  }

  return (
    <div>
      <button onClick={onBack} className="text-gray-400 hover:text-white mb-8">
        &larr; {t('common.backToProjects')}
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <SliderAdForm 
            adData={adData} 
            updateAdData={updateAdData}
            onExport={handleExport}
            onGifExport={handleGifExport}
            onBeforeImageUpload={(f) => handleImageUpload('beforeImage', f)}
            onAfterImageUpload={(f) => handleImageUpload('afterImage', f)}
            onLogoUpload={(f) => handleImageUpload('logoImage', f)}
          />
        </div>
        <div className="lg:col-span-2 flex justify-center items-start">
          <SliderPreview adData={adData} adRef={adRef} />
        </div>
      </div>
    </div>
  );
};

export default SliderAdCreatorPage;
