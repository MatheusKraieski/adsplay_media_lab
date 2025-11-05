import React from 'react';
import { CubeAdData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface CubePreviewProps {
  adData: CubeAdData;
}

const CubePreview: React.FC<CubePreviewProps> = ({ adData }) => {
    const { t } = useLanguage();
    const [width, height] = adData.size.split('x').map(Number);
    const translateZ = width / 2;

    const keyframes = `
        @keyframes rotate-cube {
            0% { transform: rotateY(-25deg); }
            100% { transform: rotateY(-385deg); }
        }
    `;

    return (
        <div className="flex flex-col items-center">
            <h3 className="text-lg font-bold mb-4">{t('preview.title')}</h3>
            <style>{keyframes}</style>
            <a href={adData.destinationUrl} target="_blank" rel="noopener noreferrer">
                <div 
                    className="scene" 
                    style={{ 
                        width: `${width}px`, 
                        height: `${height}px`,
                        perspective: `${width * 4}px`
                    }}
                >
                    <div 
                        className="cube" 
                        style={{
                            width: '100%',
                            height: '100%',
                            position: 'relative',
                            transformStyle: 'preserve-3d',
                            transform: 'rotateY(-25deg)', // Initial rotation from screenshot
                            animation: `rotate-cube ${adData.rotationSpeed}s infinite linear`
                        }}
                    >
                        <div 
                            className="cube-face front"
                            style={{
                                position: 'absolute',
                                width: `${width}px`,
                                height: `${height}px`,
                                backgroundImage: `url(${adData.frontImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                transform: `rotateY(0deg) translateZ(${translateZ}px)`
                            }}
                        />
                        <div 
                            className="cube-face right"
                            style={{
                                position: 'absolute',
                                width: `${width}px`,
                                height: `${height}px`,
                                backgroundImage: `url(${adData.sideImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                transform: `rotateY(90deg) translateZ(${translateZ}px)`
                            }}
                        />
                        <div 
                            className="cube-face back"
                            style={{
                                position: 'absolute',
                                width: `${width}px`,
                                height: `${height}px`,
                                backgroundImage: `url(${adData.frontImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                transform: `rotateY(180deg) translateZ(${translateZ}px)`
                            }}
                        />
                        <div 
                            className="cube-face left"
                            style={{
                                position: 'absolute',
                                width: `${width}px`,
                                height: `${height}px`,
                                backgroundImage: `url(${adData.sideImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                transform: `rotateY(-90deg) translateZ(${translateZ}px)`
                            }}
                        />
                    </div>
                </div>
            </a>
        </div>
    );
};

export default CubePreview;