import React, { useState } from 'react';
import { CubeAdData } from '../types';
import CubeAdForm from '../components/CubeAdForm';
import CubePreview from '../components/CubePreview';
import { useLanguage } from '../contexts/LanguageContext';
import { exportCubeAdHtml, exportCubeAdZip } from '../services/exportService';

interface CubeAdCreatorPageProps {
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

const CubeAdCreatorPage: React.FC<CubeAdCreatorPageProps> = ({ onBack }) => {
  const { t } = useLanguage();

  const [adData, setAdData] = useState<CubeAdData>({
    size: '300x250',
    frontImage: 'https://storage.googleapis.com/adsplay-media-lab-assets/carousel-1.png',
    sideImage: 'https://storage.googleapis.com/adsplay-media-lab-assets/carousel-2.png',
    destinationUrl: 'https://google.com',
    rotationSpeed: 8,
  });

  const updateAdData = (field: keyof CubeAdData, value: any) => {
    setAdData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleExport = (type: 'html' | 'zip') => {
    if (type === 'zip') {
      exportCubeAdZip(adData);
    } else {
      exportCubeAdHtml(adData);
    }
  };

  const handleImageUpload = async (field: 'frontImage' | 'sideImage', file: File) => {
    try {
        const dataUrl = await fileToDataUrl(file);
        updateAdData(field, dataUrl);
    } catch (error) {
        console.error(`Failed to read file for ${String(field)}`, error);
    }
  }

  return (
    <div>
      <button onClick={onBack} className="text-gray-400 hover:text-white mb-6">
        &larr; {t('common.backToProjects')}
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 max-h-[calc(100vh-9rem)] overflow-y-auto pr-2 custom-scrollbar">
          <CubeAdForm
            adData={adData}
            updateAdData={updateAdData}
            onExport={handleExport}
            onFrontImageUpload={(f) => handleImageUpload('frontImage', f)}
            onSideImageUpload={(f) => handleImageUpload('sideImage', f)}
          />
        </div>
        <div className="lg:col-span-2 flex justify-center items-start">
          <CubePreview adData={adData} />
        </div>
      </div>
    </div>
  );
};

export default CubeAdCreatorPage;