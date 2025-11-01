import React, { useState, useRef, useEffect, useCallback } from 'react';
import { VideoDisplayAdData } from '../types';
import { MuteIcon } from './icons/MuteIcon';
import { UnmuteIcon } from './icons/UnmuteIcon';
import { useLanguage } from '../contexts/LanguageContext';

interface VideoDisplayAdPreviewProps {
  adData: VideoDisplayAdData;
}

const VideoDisplayAdPreview: React.FC<VideoDisplayAdPreviewProps> = ({ adData }) => {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const getLayout = useCallback(() => {
    const [width, height] = adData.size.split('x').map(Number);
    let videoStyle: React.CSSProperties = {};
    let imageStyle: React.CSSProperties = {};
    let containerStyle: React.CSSProperties = { display: 'flex' };

    switch(adData.size) {
        case '970x250':
            videoStyle = { width: '444px', height: '250px' };
            imageStyle = { width: '526px', height: '250px' };
            containerStyle.flexDirection = 'row';
            break;
        case '300x600':
            const videoHeight600 = Math.round(300 * (9 / 16)); // 169px
            videoStyle = { width: '300px', height: `${videoHeight600}px` };
            imageStyle = { width: '300px', height: `${600 - videoHeight600}px` };
            containerStyle.flexDirection = 'column';
            break;
        case '336x280':
            const videoHeight280 = Math.round(336 * (9 / 16)); // 189px
            videoStyle = { width: '336px', height: `${videoHeight280}px` };
            imageStyle = { width: '336px', height: `${280 - videoHeight280}px` };
            containerStyle.flexDirection = 'column';
            break;
        case '300x250':
        default:
            const videoHeight250 = Math.round(300 * (9 / 16)); // 169px
            videoStyle = { width: '300px', height: `${videoHeight250}px` };
            imageStyle = { width: '300px', height: `${250 - videoHeight250}px` };
            containerStyle.flexDirection = 'column';
            break;
    }
    return { width, height, videoStyle, imageStyle, containerStyle };
  }, [adData.size]);
  
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

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return '0.0';
    return `${time.toFixed(1)}`;
  };
  
  const { width, height, videoStyle, imageStyle, containerStyle } = getLayout();
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col items-center">
        <h3 className="text-xl font-bold mb-4">{t('preview.title')}</h3>
        <a href={adData.destinationUrl} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
            <div
              className="relative overflow-hidden bg-gray-900"
              style={{ width, height, ...containerStyle }}
            >
                <div className="video-wrapper relative" style={{...videoStyle, flexShrink: 0, backgroundColor: 'black'}}>
                    <video
                        ref={videoRef}
                        key={adData.videoContent}
                        style={{ width: '100%', height: '100%', objectFit: 'contain'}}
                        src={adData.videoContent}
                        playsInline
                        loop
                        autoPlay
                        muted={isMuted}
                    />
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute bottom-0 left-0 right-0 p-2 text-white bg-gradient-to-t from-black/50 to-transparent">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-mono">{formatTime(currentTime)} / {formatTime(duration)}s</span>
                                <button onClick={toggleMute} className="pointer-events-auto p-1">
                                    {isMuted ? <MuteIcon /> : <UnmuteIcon />}
                                </button>
                            </div>
                            <div className="relative w-full h-1 bg-white/30 rounded-full mt-1">
                                <div className="absolute h-full bg-orange-500 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="image-wrapper" style={{...imageStyle, flexShrink: 0}}>
                    <img src={adData.imageContent} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} alt="Static part of the ad" />
                </div>
            </div>
        </a>
    </div>
  );
};

export default VideoDisplayAdPreview;
