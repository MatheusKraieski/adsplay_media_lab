import React, { useState } from 'react';
import { VideoDisplayAdData } from '../types';
import VideoDisplayAdForm from '../components/SoccerAdForm';
import VideoDisplayAdPreview from '../components/SoccerPreview';
import { useLanguage } from '../contexts/LanguageContext';
import { exportVideoDisplayAd } from '../services/exportService';

interface VideoDisplayAdCreatorPageProps {
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

const VideoDisplayAdCreatorPage: React.FC<VideoDisplayAdCreatorPageProps> = ({ onBack }) => {
  const { t } = useLanguage();

  const [adData, setAdData] = useState<VideoDisplayAdData>({
    size: '970x250',
    destinationUrl: 'https://google.com',
    videoContent: 'https://storage.googleapis.com/adsplay-media-lab-assets/video-placeholder.mp4',
    imageContent: 'https://storage.googleapis.com/adsplay-media-lab-assets/display-placeholder.png',
  });

  const updateAdData = (field: keyof VideoDisplayAdData, value: any) => {
    setAdData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleExport = (platform: 'dv360' | 'gam') => {
    exportVideoDisplayAd(adData, platform);
  };

  const handleImageUpload = async (field: keyof VideoDisplayAdData, file: File) => {
    try {
        const dataUrl = await fileToDataUrl(file);
        updateAdData(field, dataUrl);
    } catch (error) {
        console.error(`Failed to read file for ${String(field)}`, error);
    }
  }

  return (
    <div>
      <button onClick={onBack} className="text-gray-400 hover:text-white mb-8">
        &larr; {t('common.backToProjects')}
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <VideoDisplayAdForm
            adData={adData}
            updateAdData={updateAdData}
            onExport={handleExport}
            onVideoUpload={(f) => handleImageUpload('videoContent', f)}
            onImageUpload={(f) => handleImageUpload('imageContent', f)}
          />
        </div>
        <div className="lg:col-span-2 flex justify-center items-start">
          <VideoDisplayAdPreview adData={adData} />
        </div>
      </div>
    </div>
  );
};

export default VideoDisplayAdCreatorPage;