
import React, { useState, useRef } from 'react';
import { AdData } from '../types';
import AdCreatorForm from '../components/AdCreatorForm';
import AdPreview from '../components/AdPreview';
import { useLanguage } from '../contexts/LanguageContext';
import { exportHtmlAd } from '../services/exportService';

interface VideoAdCreatorPageProps {
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

const VideoAdCreatorPage: React.FC<VideoAdCreatorPageProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const adRef = useRef<HTMLDivElement>(null);

  const [adData, setAdData] = useState<AdData>({
    size: '300x250',
    videoContent: 'https://storage.googleapis.com/adsplay-media-lab-assets/video-placeholder.mp4',
    avatar: 'https://storage.googleapis.com/adsplay-media-lab-assets/avatar-placeholder.png',
    publisher: 'The Brand',
    isVerified: true,
    textColor: '#ffffff',
    likes: '1.2M',
    comments: '4,832',
    brand: 'BrandName',
    captionText: 'This is an amazing product you should buy.',
    hashtag: '#bestproduct',
    destinationUrl: 'https://google.com',
  });

  const updateAdData = (field: keyof AdData, value: any) => {
    setAdData(prev => ({ ...prev, [field]: value }));
  };

  const handleVideoFile = async (file: File) => {
    const dataUrl = await fileToDataUrl(file);
    updateAdData('videoContent', dataUrl);
  };

  const handleAvatarFile = async (file: File) => {
    const dataUrl = await fileToDataUrl(file);
    updateAdData('avatar', dataUrl);
  };
  
  const handleExport = (platform: 'dv360' | 'gam') => {
    exportHtmlAd(adData, platform);
  };

  return (
    <div>
      <button onClick={onBack} className="text-gray-400 hover:text-white mb-8">
        &larr; {t('common.backToProjects')}
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <AdCreatorForm 
            adData={adData} 
            updateAdData={updateAdData}
            onVideoFileSelect={handleVideoFile}
            onAvatarFileSelect={handleAvatarFile}
            onExport={handleExport}
          />
        </div>
        <div className="lg:col-span-2 flex justify-center items-start">
          <AdPreview adData={adData} adRef={adRef} />
        </div>
      </div>
    </div>
  );
};

export default VideoAdCreatorPage;
