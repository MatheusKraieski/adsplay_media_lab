import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SliderAdData } from '../types';
import { ArrowsIcon } from './icons/ArrowsIcon';
import { DragIcon } from './icons/DragIcon';

interface SliderPreviewProps {
  adData: SliderAdData;
  adRef: React.RefObject<HTMLDivElement>;
}

const hexToRgba = (hex: string, alpha: number): string => {
    if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) return hex;
    let c: any = hex.substring(1).split('');
    if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},${alpha})`;
};


const SliderPreview: React.FC<SliderPreviewProps> = ({ adData, adRef }) => {
  const [sliderPos, setSliderPos] = useState(adData.startPositionPct);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  // FIX: Initialize useRef with an initial value (null) to avoid errors.
  const animationFrame = useRef<number | null>(null);

  const getPreviewSize = useCallback(() => {
    const [width, height] = adData.size.split('x').map(Number);
    return { width, height };
  }, [adData.size]);

  const updatePosition = useCallback((clientX: number) => {
    if (!adRef.current) return;
    const rect = adRef.current.getBoundingClientRect();
    let newPos = ((clientX - rect.left) / rect.width) * 100;
    newPos = Math.max(0, Math.min(newPos, 100));
    setSliderPos(newPos);
  }, [adRef]);
  
  useEffect(() => {
    const adElement = adRef.current;
    if (!adElement) return;
    
    const handlePointerDown = (e: PointerEvent) => {
        isDragging.current = true;
        hasDragged.current = false;
        document.body.style.cursor = 'ew-resize';
        // FIX: Ensure cancelAnimationFrame receives a number.
        if (animationFrame.current) {
          cancelAnimationFrame(animationFrame.current);
        }
        // FIX: Update slider position on initial click for better UX.
        updatePosition(e.clientX);
        e.preventDefault();
    };

    const handlePointerMove = (e: PointerEvent) => {
        if (isDragging.current) {
            hasDragged.current = true;
            updatePosition(e.clientX);
            e.preventDefault();
        }
    };
    
    const handlePointerUp = () => {
        isDragging.current = false;
        document.body.style.cursor = 'default';
    };
    
    adElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // Touch events
    const touchStart = (e: TouchEvent) => {
        // PointerEvent has clientX, but Touch does not. It is on the Touch object.
        const touch = e.touches[0];
        if (touch) {
            const mockPointerEvent = {
                ...touch,
                preventDefault: () => e.preventDefault(),
            } as unknown as PointerEvent;
            handlePointerDown(mockPointerEvent);
        }
    };
    const touchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        if (touch) {
            const mockPointerEvent = {
                ...touch,
                preventDefault: () => e.preventDefault(),
            } as unknown as PointerEvent;
            handlePointerMove(mockPointerEvent);
        }
    };
    
    adElement.addEventListener('touchstart', touchStart, { passive: false });
    window.addEventListener('touchmove', touchMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      adElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      adElement.removeEventListener('touchstart', touchStart);
      window.removeEventListener('touchmove', touchMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [adRef, updatePosition]);

  const preventClick = (e: React.MouseEvent) => {
      if(hasDragged.current) {
          e.preventDefault();
          e.stopPropagation();
      }
  }

  useEffect(() => {
    setSliderPos(adData.startPositionPct);
  }, [adData.startPositionPct]);
  
  useEffect(() => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
    if (adData.hintAnimation && !isDragging.current) {
      let startTime: number | null = null;
      const animate = (time: number) => {
        if (!startTime) startTime = time;
        const elapsed = time - startTime;
        const duration = adData.sweepDurationMs;
        const startPos = adData.startPositionPct;

        let newPos = startPos;
        const progress = (elapsed % duration) / duration;
        newPos = startPos + 50 * Math.sin(progress * 2 * Math.PI);
        newPos = Math.max(0, Math.min(100, newPos));


        if (elapsed < duration || adData.hintLoop) {
          setSliderPos(newPos);
          animationFrame.current = requestAnimationFrame(animate);
        } else {
           setSliderPos(startPos);
        }
      };
      animationFrame.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [adData.hintAnimation, adData.hintLoop, adData.sweepDurationMs, adData.startPositionPct]);

  const { width, height } = getPreviewSize();
  const clipValue = `inset(0 ${100 - sliderPos}% 0 0)`;

  const zoomKeyframes = `
    @keyframes adsplayZoom {
      from { transform: translate(-50%, -50%) scale(1); }
      to { transform: translate(-50%, -50%) scale(${adData.zoomLevel / 100}); }
    }
  `;

  const imageBaseStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: `translate(-50%, -50%) scale(1)`,
    WebkitTransform: `translate(-50%, -50%) scale(1)`,
    pointerEvents: 'none',
    maxWidth: 'none',
  };

  if (adData.animateZoom) {
    imageBaseStyle.animation = `adsplayZoom ${adData.zoomDuration}s ease-in-out infinite alternate`;
  } else {
    const scale = adData.zoomLevel / 100;
    imageBaseStyle.transform = `translate(-50%, -50%) scale(${scale})`;
    imageBaseStyle.WebkitTransform = `translate(-50%, -50%) scale(${scale})`;
  }

  const ctaBaseStyle = {
    position: 'absolute',
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '14px',
    textDecoration: 'none',
    color: adData.ctaColor,
    zIndex: 4,
    pointerEvents: 'auto',
  } as React.CSSProperties;

  const getCtaStyle = () => {
    switch (adData.ctaStyle) {
      case 'ghost':
        return { ...ctaBaseStyle, backgroundColor: 'transparent', border: `2px solid ${adData.ctaBg}` };
      case 'glass':
        return { ...ctaBaseStyle, backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)' };
      case 'solid':
      default:
        return { ...ctaBaseStyle, backgroundColor: adData.ctaBg, border: '2px solid transparent' };
    }
  };

  const getLabelStyle = (side: 'before' | 'after') => {
    const baseStyle: React.CSSProperties = {
        position: 'absolute',
        padding: '4px 8px',
        fontSize: '12px',
        fontWeight: 'bold',
        backgroundColor: adData.labelBg,
        color: adData.labelColor,
        opacity: 0.8,
        pointerEvents: 'none',
        zIndex: 3,
    };

    if (adData.template === 'classic') {
        baseStyle.top = '10px';
        if (side === 'before') baseStyle.left = '10px';
        if (side === 'after') baseStyle.right = '10px';
    } else { // modern
        baseStyle.bottom = '10px';
        if (side === 'before') baseStyle.left = '10px';
        if (side === 'after') baseStyle.right = '10px';
    }

    switch(adData.labelStyle) {
        case 'tag':
            if (side === 'before') {
                baseStyle.borderRadius = '4px 0 0 4px';
            } else {
                baseStyle.borderRadius = '0 4px 4px 0';
            }
            break;
        case 'badge':
             baseStyle.borderRadius = '4px';
             break;
        case 'pill':
        default:
             baseStyle.borderRadius = '9999px';
             break;
    }
    return baseStyle;
  }
  
  const handleStyle : React.CSSProperties = {
    position: 'absolute', 
    top: '50%', 
    left: '50%', 
    transform: 'translate(-50%, -50%)', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    pointerEvents: 'auto',
  };
  
  const handleVisual: React.CSSProperties = {
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: adData.handleStyle === 'line' ? 'transparent' : adData.dividerColor
  };

  if(adData.handleStyle === 'circle') {
      handleVisual.width = adData.handleThickness * 8;
      handleVisual.height = adData.handleThickness * 8;
      handleVisual.borderRadius = '50%';
      handleVisual.backgroundColor = hexToRgba(adData.dividerColor, 0.8);
      handleVisual.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
  } else if (adData.handleStyle === 'pill') {
      handleVisual.width = adData.handleThickness * 10;
      handleVisual.height = adData.handleThickness * 5;
      handleVisual.borderRadius = '99px';
  } else if (adData.handleStyle === 'line') {
      handleVisual.height = '40px';
  }

  const iconColor = (adData.handleStyle === 'circle' || adData.handleStyle === 'pill') 
    ? '#000000' 
    : adData.dividerColor;

  const classicLayout = (
    <>
      <div className="absolute inset-0 pointer-events-none z-[3]" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 20%, transparent 50%)' }}></div>
      {(adData.headline || adData.caption) && (
        <div className="absolute bottom-3 left-3 right-[120px] pointer-events-none z-[3]" style={{color: adData.fgColor, textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}>
          {adData.headline && <h3 className={`font-bold ${width > 400 ? 'text-2xl' : 'text-lg'} mb-1`}>{adData.headline}</h3>}
          {adData.caption && <p className={width > 400 ? 'text-base' : 'text-xs'}>{adData.caption}</p>}
        </div>
      )}
    </>
  );

  const modernLayout = (
    <>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 z-[3] pointer-events-none"></div>
        {(adData.headline || adData.caption) && (
            <div className="absolute top-5 left-2.5 right-2.5 text-center pointer-events-none z-[3]" style={{color: adData.fgColor, textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}>
                {adData.headline && <h3 className={`font-bold ${width > 400 ? 'text-2xl' : 'text-lg'} mb-1`}>{adData.headline}</h3>}
                {adData.caption && <p className={width > 400 ? 'text-base' : 'text-xs'}>{adData.caption}</p>}
            </div>
        )}
    </>
  );

  const logoStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${adData.logoPositionX}%`,
    top: `${adData.logoPositionY}%`,
    transform: `translate(-50%, -50%) scale(${adData.logoZoom / 100})`,
    WebkitTransform: `translate(-50%, -50%) scale(${adData.logoZoom / 100})`,
    maxWidth: '35%',
    maxHeight: '35%',
    objectFit: 'contain',
    pointerEvents: 'none',
    zIndex: 4, 
  };

  return (
    <div
      ref={adRef}
      className="relative overflow-hidden bg-black shadow-lg select-none"
      style={{ width, height }}
    >
      {adData.animateZoom && <style>{zoomKeyframes}</style>}
      
      {/* Before Layer */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}>
        <img src={adData.beforeImage} alt="Before" style={imageBaseStyle} />
        <a 
          href={adData.beforeDestinationUrl} 
          onClick={preventClick} 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute inset-0 block cursor-pointer"
        ></a>
      </div>

      {/* After Layer (Clipped Container) */}
      <div 
        className="absolute inset-0 overflow-hidden" 
        style={{ zIndex: 2, clipPath: clipValue, WebkitClipPath: clipValue }}
      >
        <img src={adData.afterImage} alt="After" style={imageBaseStyle} />
        <a 
          href={adData.afterDestinationUrl}
          onClick={preventClick}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 block cursor-pointer"
        ></a>
      </div>

      {/* Overlays Layer */}
      <div className="overlays absolute inset-0 pointer-events-none z-[3]">
        {adData.template === 'classic' ? classicLayout : modernLayout}
        {adData.logoImage && <img src={adData.logoImage} alt="Logo" style={logoStyle} />}
      </div>
      
      {/* Labels Layer - Placed on top of images but below handle */}
      {adData.showLabels && adData.labelStyle !== 'none' && (
        <>
            <div style={getLabelStyle('before')}>{adData.beforeLabel}</div>
            <div style={getLabelStyle('after')}>{adData.afterLabel}</div>
        </>
      )}
      
      {/* Handle Layer */}
      <div
        className="absolute top-0 bottom-0 cursor-ew-resize"
        style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)', width: `${adData.dividerWidth}px`, backgroundColor: adData.dividerColor, zIndex: 5, pointerEvents: 'none' }}
      >
        <div style={handleStyle}>
            <div className="handle-visual" style={handleVisual}>
                 <div style={{ color: iconColor, width: '50%', height: '50%'}}>
                    {adData.handleIcon === 'arrows' && <ArrowsIcon />}
                    {adData.handleIcon === 'drag' && <DragIcon />}
                </div>
            </div>
        </div>
      </div>

      {/* CTA Button for Classic Template */}
      {adData.showCta && adData.template === 'classic' && (
        <a 
          href={adData.afterDestinationUrl} 
          onClick={preventClick} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="absolute bottom-3 right-3"
          style={getCtaStyle()}
        >
          {adData.ctaText}
        </a>
      )}
    </div>
  );
};

export default SliderPreview;
