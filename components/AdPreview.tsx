import React, { useState, useRef, useEffect } from 'react';
import { AdData } from '../types';
import { LikeIcon } from './icons/LikeIcon';
import { CommentIcon } from './icons/CommentIcon';
import { VerifiedIcon } from './icons/VerifiedIcon';
import { useLanguage } from '../contexts/LanguageContext';
import { MuteIcon } from './icons/MuteIcon';
import { UnmuteIcon } from './icons/UnmuteIcon';

interface AdPreviewProps {
  adData: AdData;
  adRef: React.RefObject<HTMLDivElement>;
}

const AdPreview: React.FC<AdPreviewProps> = ({ adData, adRef }) => {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);

    video.volume = isMuted ? 0 : 1;

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [adData.videoContent]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMuted(!isMuted);
  };
  
  const getPreviewSize = () => {
      switch (adData.size) {
          case '300x600': return { width: 300, height: 600 };
          case '336x280': return { width: 336, height: 280 };
          case '300x250':
          default:
            return { width: 300, height: 250 };
      }
  }

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return '0.0s';
    return `${time.toFixed(1)}s`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const { width, height } = getPreviewSize();

  return (
    <div className="flex flex-col items-center">
        <h3 className="text-lg font-bold mb-4">{t('preview.title')}</h3>
        <a href={adData.destinationUrl} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
        <div ref={adRef} className="relative overflow-hidden bg-black rounded-lg shadow-lg" style={{ width, height }}>
            {adData.videoContent ? (
                <video
                    ref={videoRef}
                    key={adData.videoContent}
                    className="w-full h-full object-cover"
                    src={adData.videoContent}
                    playsInline
                    loop
                    autoPlay
                    muted={isMuted}
                />
            ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400 text-center p-4">
                    Your video will appear here.
                </div>
            )}
            
            <div className="absolute inset-0 pointer-events-none" style={{ color: adData.textColor }}>
                
                {/* Top Overlay */}
                <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start bg-gradient-to-b from-black/50 to-transparent">
                    <div className="flex items-center space-x-2">
                        {adData.avatar && <img src={adData.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-white/50" />}
                        <div>
                            <div className="font-bold text-sm flex items-center">
                                {adData.publisher}
                                {adData.isVerified && <span className="ml-1"><VerifiedIcon /></span>}
                            </div>
                            <div className="text-xs text-gray-300">Sponsored</div>
                        </div>
                    </div>
                    {adData.videoContent && (
                        <button onClick={toggleMute} className="text-white bg-black/50 rounded-full p-1 pointer-events-auto">
                            {isMuted ? <MuteIcon /> : <UnmuteIcon />}
                        </button>
                    )}
                </div>

                {/* Bottom Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 text-shadow bg-gradient-to-t from-black/70 to-transparent">
                    <div className="flex items-center space-x-4 mb-2">
                        <div className="flex items-center space-x-1">
                            <LikeIcon />
                            <span className="text-xs font-semibold">{adData.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <CommentIcon />
                            <span className="text-xs font-semibold">{adData.comments}</span>
                        </div>
                    </div>
                    
                    <p className="text-sm font-bold">{adData.brand}: <span className="font-normal">{adData.captionText}</span> <span className="font-semibold">{adData.hashtag}</span></p>
                    
                    {adData.videoContent && (
                    <div className="relative w-full h-[4px] bg-white/30 rounded-full mt-2 mb-2">
                        <div className="absolute h-full bg-orange-500 rounded-full" style={{ width: `${progress}%` }}></div>
                        <span className="absolute -bottom-4 left-0 text-xs font-mono">{formatTime(currentTime)}</span>
                        <span className="absolute -bottom-4 right-0 text-xs font-mono">{formatTime(duration)}</span>
                    </div>
                    )}
                </div>
            </div>
        </div>
        </a>
    </div>
  );
};

export default AdPreview;