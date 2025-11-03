import { AdData, SliderAdData, VideoDisplayAdData, CarouselAdData } from '../types';

declare const JSZip: any;

const downloadFile = (filename: string, content: string | Blob, type = 'text/html') => {
    const element = document.createElement('a');
    const file = content instanceof Blob ? content : new Blob([content], { type });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
};

// A very basic HTML template for video ads
const createVideoAdHtml = (adData: AdData, platform: 'dv360' | 'gam'): string => {
    // In a real app, this would be a much more complex templating system.
    const clicktagMacro = platform === 'gam' ? '%%CLICK_URL_UNESC%%' : '{{PUB_CLKT}}';
    const clicktag = `${clicktagMacro}${adData.destinationUrl}`;
    const [width, height] = adData.size.split('x');
    return `
<html>
<head>
    <meta name="ad.size" content="width=${width},height=${height}">
    <style>
        body, html { margin: 0; padding: 0; }
        .ad-container {
            width: ${width}px;
            height: ${height}px;
            position: relative;
            overflow: hidden;
            background-color: black;
        }
        video { width: 100%; height: 100%; object-fit: cover; }
    </style>
</head>
<body>
    <a href="${clicktag}" target="_blank">
        <div class="ad-container">
            <video src="${adData.videoContent}" autoplay muted loop playsinline></video>
            <!-- Overlays would be added here in a real implementation -->
        </div>
    </a>
</body>
</html>`;
};

export const exportHtmlAd = (adData: AdData, platform: 'dv360' | 'gam') => {
    const htmlContent = createVideoAdHtml(adData, platform);
    downloadFile(`video_ad_${adData.size}.html`, htmlContent);
};

const hexToRgba = (hex: string, alpha: number): string => {
    if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) return hex;
    let c: any = hex.substring(1).split('');
    if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},${alpha})`;
};

const createSliderAdHtml = (adData: SliderAdData): string => {
    const [width, height] = adData.size.split('x').map(Number);
    const clicktagBefore = '%%CLICK_URL_UNESC%%' + adData.beforeDestinationUrl;
    const clicktagAfter = '%%CLICK_URL_UNESC%%' + adData.afterDestinationUrl;

    const getCtaStyle = () => {
        let style = `
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: bold;
            font-size: 14px;
            text-decoration: none;
            color: ${adData.ctaColor};
            pointer-events: auto;
            display: inline-block;
        `;
        switch (adData.ctaStyle) {
            case 'ghost':
                style += `background-color: transparent; border: 2px solid ${adData.ctaBg};`;
                break;
            case 'glass':
                style += `background-color: rgba(255, 255, 255, 0.2); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);`;
                break;
            case 'solid':
            default:
                style += `background-color: ${adData.ctaBg}; border: 2px solid transparent;`;
                break;
        }
        return style;
    };

    const getLabelBaseStyle = (side: 'before' | 'after') => {
        let style = `
            position: absolute;
            padding: 4px 8px;
            font-size: 12px;
            font-weight: bold;
            background-color: ${adData.labelBg};
            color: ${adData.labelColor};
            opacity: 0.8;
            pointer-events: none;
            z-index: 3;
            box-sizing: border-box;
        `;
        if (adData.template === 'classic') {
            style += `top: 10px;`;
            if (side === 'before') style += `left: 10px;`;
            if (side === 'after') style += `right: 10px;`;
        } else { // modern
            style += `bottom: 10px;`;
            if (side === 'before') style += `left: 10px;`;
            if (side === 'after') style += `right: 10px;`;
        }
        return style;
    };

    const getLabelStyle = (side: 'before' | 'after') => {
        let style = getLabelBaseStyle(side);
        switch(adData.labelStyle) {
            case 'tag':
                if (side === 'before') style += `border-radius: 4px 0 0 4px;`;
                else style += `border-radius: 0 4px 4px 0;`;
                break;
            case 'badge':
                 style += `border-radius: 4px;`;
                 break;
            case 'pill':
            default:
                 style += `border-radius: 9999px;`;
                 break;
        }
        return style;
    };

    const getHandleVisualCss = () => {
        let css = `
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: ${adData.handleStyle === 'line' ? 'transparent' : adData.dividerColor};
        `;
        if(adData.handleStyle === 'circle') {
            css += `
                width: ${adData.handleThickness * 8}px;
                height: ${adData.handleThickness * 8}px;
                border-radius: 50%;
                background-color: ${hexToRgba(adData.dividerColor, 0.8)};
                box-shadow: 0 0 10px rgba(0,0,0,0.5);
            `;
        } else if (adData.handleStyle === 'pill') {
            css += `
                width: ${adData.handleThickness * 10}px;
                height: ${adData.handleThickness * 5}px;
                border-radius: 99px;
            `;
        } else if (adData.handleStyle === 'line') {
            css += `height: 40px;`;
        }
        return css;
    };

    const iconColor = (adData.handleStyle === 'circle' || adData.handleStyle === 'pill') 
        ? '#000000' 
        : adData.dividerColor;
    
    const arrowsIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 50%; height: 50%;"><line x1="4" y1="12" x2="20" y2="12"></line><polyline points="15 7 20 12 15 17"></polyline><polyline points="9 7 4 12 9 17"></polyline></svg>`;
    const dragIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${iconColor}" style="width: 50%; height: 50%;"><circle cx="12" cy="9" r="1.5"></circle><circle cx="12" cy="12" r="1.5"></circle><circle cx="12" cy="15" r="1.5"></circle></svg>`;
    const handleIconSvg = adData.handleIcon === 'arrows' ? arrowsIcon : (adData.handleIcon === 'drag' ? dragIcon : '');

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="ad.size" content="width=${width},height=${height}">
        <style>
          body, html { margin: 0; padding: 0; }
          .ad-container {
            width: ${width}px;
            height: ${height}px;
            position: relative;
            overflow: hidden;
            background-color: black;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;
            box-sizing: border-box;
          }
          *, *::before, *::after { box-sizing: inherit; }
          .image-wrapper { position: absolute; inset: 0; overflow: hidden; }
          .image-wrapper img {
            position: absolute;
            top: 50%; left: 50%;
            width: 100%; height: 100%;
            object-fit: cover;
            transform: translate(-50%, -50%) scale(${adData.animateZoom ? 1 : adData.zoomLevel / 100});
            max-width: none;
            pointer-events: none;
            animation: ${adData.animateZoom ? `adsplayZoom ${adData.zoomDuration}s ease-in-out infinite alternate` : 'none'};
          }
          .after-wrapper {
            clip-path: inset(0 0 0 ${adData.startPositionPct}%);
            -webkit-clip-path: inset(0 0 0 ${adData.startPositionPct}%);
          }
          .image-wrapper a { position: absolute; inset: 0; display: block; }
          @keyframes adsplayZoom {
            from { transform: translate(-50%, -50%) scale(1); }
            to { transform: translate(-50%, -50%) scale(${adData.zoomLevel / 100}); }
          }
          .slider-divider {
            position: absolute;
            top: 0; bottom: 0;
            left: ${adData.startPositionPct}%;
            transform: translateX(-50%);
            width: ${adData.dividerWidth}px;
            background-color: ${adData.dividerColor};
            pointer-events: none;
            z-index: 5;
          }
          .slider-handle-container {
            position: absolute;
            top: 50%;
            left: ${adData.startPositionPct}%;
            transform: translate(-50%, -50%);
            cursor: ew-resize;
            z-index: 6;
            padding: 20px; 
            margin: -20px;
          }
          .slider-handle { ${getHandleVisualCss()} }
          .overlays { position: absolute; inset: 0; pointer-events: none; z-index: 3; }
          .logo {
            position: absolute;
            left: ${adData.logoPositionX}%;
            top: ${adData.logoPositionY}%;
            transform: translate(-50%, -50%) scale(${adData.logoZoom / 100});
            max-width: 35%;
            max-height: 35%;
            object-fit: contain;
            pointer-events: none;
            z-index: 4;
          }
          ${
            adData.template === 'classic' ? `
            .text-gradient { background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 20%, transparent 50%); }
            .text-container {
              position: absolute;
              bottom: 12px; left: 12px; right: 128px;
              color: ${adData.fgColor};
              text-shadow: 1px 1px 3px rgba(0,0,0,0.7);
            }
            .headline { font-weight: bold; font-size: ${width > 400 ? '24px' : '18px'}; margin: 0 0 4px 0; }
            .caption { font-size: ${width > 400 ? '16px' : '12px'}; margin: 0; }
            .cta-container { position: absolute; bottom: 12px; right: 12px; z-index: 4; }
            ` : `
            .text-gradient { background: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 50%, rgba(0,0,0,0.6)); }
            .text-container {
              position: absolute;
              top: 20px; left: 10px; right: 10px;
              text-align: center;
              color: ${adData.fgColor};
              text-shadow: 1px 1px 3px rgba(0,0,0,0.7);
            }
            .headline { font-weight: bold; font-size: ${width > 400 ? '24px' : '18px'}; margin: 0 0 4px 0; }
            .caption { font-size: ${width > 400 ? '16px' : '12px'}; margin: 0; }
            `
          }
        </style>
    </head>
    <body>
        <div class="ad-container" id="ad-container">
            <div class="image-wrapper before-wrapper" style="z-index: 1;">
                <img src="${adData.beforeImage}" alt="Before">
                <a href="${clicktagBefore}" target="_blank"></a>
            </div>
            <div class="image-wrapper after-wrapper" style="z-index: 2;">
                <img src="${adData.afterImage}" alt="After">
                <a href="${clicktagAfter}" target="_blank"></a>
            </div>
            <div class="overlays">
                <div class="text-gradient" style="position: absolute; inset: 0;"></div>
                <div class="text-container">
                    ${adData.headline ? `<h3 class="headline">${adData.headline}</h3>` : ''}
                    ${adData.caption ? `<p class="caption">${adData.caption}</p>` : ''}
                </div>
                ${adData.logoImage ? `<img src="${adData.logoImage}" alt="Logo" class="logo">` : ''}
            </div>
            ${adData.showLabels && adData.labelStyle !== 'none' ? `
                <div class="before-label" style="${getLabelStyle('before')}">${adData.beforeLabel}</div>
                <div class="after-label" style="${getLabelStyle('after')}">${adData.afterLabel}</div>
            ` : ''}
            <div class="slider-divider" id="slider-divider"></div>
            <div class="slider-handle-container" id="slider-handle">
                <div class="slider-handle">${handleIconSvg}</div>
            </div>
            ${(adData.showCta && adData.template === 'classic') ? `
                <div class="cta-container">
                    <a href="${clicktagAfter}" target="_blank" style="${getCtaStyle()}">${adData.ctaText}</a>
                </div>` : ''}
        </div>

        <script>
            (function() {
                var ad = document.getElementById('ad-container');
                var afterWrapper = ad.querySelector('.after-wrapper');
                var divider = document.getElementById('slider-divider');
                var handle = document.getElementById('slider-handle');
                
                var isDragging = false;
                var hasDragged = false;
                var animationFrame = null;
                
                function updatePosition(clientX) {
                    var rect = ad.getBoundingClientRect();
                    var newPos = ((clientX - rect.left) / rect.width) * 100;
                    newPos = Math.max(0, Math.min(100, newPos));
                    
                    afterWrapper.style.clipPath = 'inset(0 ' + (100 - newPos) + '% 0 0)';
                    afterWrapper.style.webkitClipPath = 'inset(0 ' + (100 - newPos) + '% 0 0)';
                    divider.style.left = newPos + '%';
                    handle.style.left = newPos + '%';
                }
                
                function onPointerDown(e) {
                    isDragging = true;
                    hasDragged = false;
                    document.body.style.cursor = 'ew-resize';
                    if (animationFrame) cancelAnimationFrame(animationFrame);
                    updatePosition(e.touches ? e.touches[0].clientX : e.clientX);
                    e.preventDefault();
                }
                
                function onPointerMove(e) {
                    if (isDragging) {
                        hasDragged = true;
                        updatePosition(e.touches ? e.touches[0].clientX : e.clientX);
                        e.preventDefault();
                    }
                }
                
                function onPointerUp() {
                    isDragging = false;
                    document.body.style.cursor = 'default';
                }
                
                ad.addEventListener('click', function(e) {
                    if (hasDragged) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }, true);
                
                handle.addEventListener('pointerdown', onPointerDown);
                window.addEventListener('pointermove', onPointerMove);
                window.addEventListener('pointerup', onPointerUp);
                handle.addEventListener('touchstart', onPointerDown, { passive: false });
                window.addEventListener('touchmove', onPointerMove, { passive: false });
                window.addEventListener('touchend', onPointerUp);
                
                ${adData.hintAnimation ? `
                    var startTime = null;
                    function animate(time) {
                        if (isDragging) {
                            startTime = null; // reset for next time
                            return;
                        }
                        if (!startTime) startTime = time;
                        var elapsed = time - startTime;
                        var duration = ${adData.sweepDurationMs};
                        var startPos = ${adData.startPositionPct};
                        
                        var progress = (elapsed % duration) / duration;
                        var newPos = startPos + 30 * Math.sin(progress * 2 * Math.PI);
                        
                        if (elapsed < duration || ${adData.hintLoop}) {
                            updatePosition(ad.getBoundingClientRect().left + ad.getBoundingClientRect().width * (newPos/100));
                            animationFrame = requestAnimationFrame(animate);
                        } else {
                            updatePosition(ad.getBoundingClientRect().left + ad.getBoundingClientRect().width * (startPos/100));
                        }
                    };
                    animationFrame = requestAnimationFrame(animate);
                ` : ''}
            })();
        </script>
    </body>
    </html>`;
    return htmlContent.trim();
};

export const exportSliderAd = (adData: SliderAdData) => {
    const htmlContent = createSliderAdHtml(adData);
    downloadFile(`slider_ad_${adData.size}.html`, htmlContent);
};

const dataURLtoBlob = (dataurl: string): Blob | null => {
    const arr = dataurl.split(',');
    if (arr.length < 2) return null;
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

const createVideoDisplayAdHtml = (adData: VideoDisplayAdData, platform: 'dv360' | 'gam', videoFileName?: string, imageFileName?: string): string => {
    const [width, height] = adData.size.split('x').map(Number);
    const clicktagMacro = platform === 'gam' ? '%%CLICK_URL_UNESC%%' : '{{PUB_CLKT}}';
    const clicktag = `${clicktagMacro}${adData.destinationUrl}`;
    const videoSrc = videoFileName || adData.videoContent;
    const imageSrc = imageFileName || adData.imageContent;

    let videoStyle = '';
    let imageStyle = '';
    let containerStyle = 'display: flex;';

    switch(adData.size) {
        case '970x250':
            videoStyle = 'width: 444px; height: 250px;';
            imageStyle = 'width: 526px; height: 250px;';
            containerStyle += 'flex-direction: row;';
            break;
        case '300x600':
            const videoHeight600 = Math.round(300 * (9 / 16)); // 169px
            videoStyle = `width: 300px; height: ${videoHeight600}px;`;
            imageStyle = `width: 300px; height: ${600 - videoHeight600}px;`;
            containerStyle += 'flex-direction: column;';
            break;
        case '336x280':
            const videoHeight280 = Math.round(336 * (9 / 16)); // 189px
            videoStyle = `width: 336px; height: ${videoHeight280}px;`;
            imageStyle = `width: 336px; height: ${280 - videoHeight280}px;`;
            containerStyle += 'flex-direction: column;';
            break;
        case '300x250':
        default:
            const videoHeight250 = Math.round(300 * (9 / 16)); // 169px
            videoStyle = `width: 300px; height: ${videoHeight250}px;`;
            imageStyle = `width: 300px; height: ${250 - videoHeight250}px;`;
            containerStyle += 'flex-direction: column;';
            break;
    }

    return `
<html>
  <head>
    <meta name="ad.size" content="width=${width},height=${height}">
    <style>
      body, html { margin: 0; padding: 0; }
      .ad-container {
        width: ${width}px;
        height: ${height}px;
        position: relative;
        overflow: hidden;
        background-color: black;
        ${containerStyle}
      }
      .video-wrapper { background-color: black; }
      video { object-fit: contain; }
      img { object-fit: cover; display: block; }
    </style>
  </head>
  <body>
    <a href="${clicktag}" target="_blank">
        <div class="ad-container">
            <div class="video-wrapper" style="${videoStyle}">
              <video src="${videoSrc}" style="width: 100%; height: 100%;" autoplay muted loop playsinline></video>
            </div>
            <div class="image-wrapper" style="${imageStyle}">
              <img src="${imageSrc}" style="width: 100%; height: 100%;" alt="" />
            </div>
        </div>
    </a>
  </body>
</html>`;
};


export const exportVideoDisplayAd = async (adData: VideoDisplayAdData, platform: 'dv360' | 'gam') => {
    if (platform === 'dv360' && adData.videoContent && adData.imageContent) {
        const videoExt = (adData.videoContent.startsWith('data:video/')
            ? adData.videoContent.substring(adData.videoContent.indexOf('/') + 1, adData.videoContent.indexOf(';'))
            : adData.videoContent.split('.').pop()?.split('?')[0]) || 'mp4';
        const videoFileName = `video.${videoExt}`;

        const imageExt = (adData.imageContent.startsWith('data:image/')
            ? adData.imageContent.substring(adData.imageContent.indexOf('/') + 1, adData.imageContent.indexOf(';'))
            : adData.imageContent.split('.').pop()?.split('?')[0]) || 'png';
        const imageFileName = `image.${imageExt}`;

        const htmlContent = createVideoDisplayAdHtml(adData, 'dv360', videoFileName, imageFileName);

        try {
            const zip = new JSZip();
            zip.file('index.html', htmlContent);

            // Handle video asset
            let videoBlob: Blob;
            if (adData.videoContent.startsWith('data:')) {
                const blob = dataURLtoBlob(adData.videoContent);
                if (!blob) throw new Error('Failed to convert video data URL to Blob.');
                videoBlob = blob;
            } else {
                const response = await fetch(adData.videoContent);
                if (!response.ok) throw new Error(`Failed to fetch video: ${response.statusText}`);
                videoBlob = await response.blob();
            }
            zip.file(videoFileName, videoBlob);

            // Handle image asset
            let imageBlob: Blob;
            if (adData.imageContent.startsWith('data:')) {
                const blob = dataURLtoBlob(adData.imageContent);
                if (!blob) throw new Error('Failed to convert image data URL to Blob.');
                imageBlob = blob;
            } else {
                const response = await fetch(adData.imageContent);
                if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
                imageBlob = await response.blob();
            }
            zip.file(imageFileName, imageBlob);

            const zipBlob = await zip.generateAsync({ type: 'blob' });
            downloadFile(`video_display_ad_${adData.size}_dv360.zip`, zipBlob, 'application/zip');
        } catch (error) {
            console.error("Error creating zip file:", error);
            alert("Failed to create zip file. This may be due to a network issue or CORS policy on the asset servers. Please try uploading assets instead of using URLs.");
        }
    } else {
        const htmlContent = createVideoDisplayAdHtml(adData, 'gam');
        downloadFile(`video_display_ad_${adData.size}_gam.html`, htmlContent);
    }
};

export const exportCarouselAd = (adData: CarouselAdData) => {
    // Placeholder implementation for a full export
    const [width, height] = adData.size.split('x');
    const htmlContent = `
    <html>
      <head><meta name="ad.size" content="width=${width},height=${height}"></head>
      <body>
        <h1>Carousel Ad ${adData.size}</h1>
        <p>${adData.slides.length} slides.</p>
        <p>This is a placeholder. A full implementation would include the interactive carousel logic.</p>
      </body>
    </html>`;
    downloadFile(`carousel_ad_${adData.size}.html`, htmlContent);
};