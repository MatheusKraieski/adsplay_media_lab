export enum Page {
    Home = 'home',
    VideoAd = 'video-ad',
    SliderAd = 'slider-ad',
    VideoDisplayAd = 'video-display-ad',
    CarouselAd = 'carousel-ad',
    CubeAd = 'cube-ad',
}
  
export type AdSize = '300x250' | '300x600' | '336x280';
  
export interface AdData {
    size: AdSize;
    videoContent: string;
    avatar: string;
    publisher: string;
    isVerified: boolean;
    textColor: string;
    likes: string;
    comments: string;
    brand: string;
    captionText: string;
    hashtag: string;
    destinationUrl: string;
}

export type SliderAdSize = AdSize | '160x600' | '728x90';
export type SliderHandleStyle = 'circle' | 'pill' | 'line';
export type LabelStyle = 'pill' | 'tag' | 'badge' | 'none';
export type CtaStyle = 'solid' | 'ghost' | 'glass';
export type AdTemplate = 'classic' | 'modern';

export interface SliderAdData {
    size: SliderAdSize;
    template: AdTemplate;
    beforeImage: string;
    afterImage: string;
    handleStyle: SliderHandleStyle;
    handleThickness: number;
    handleIcon: 'arrows' | 'drag' | 'none';
    dividerColor: string;
    dividerWidth: number;
    showLabels: boolean;
    labelStyle: LabelStyle;
    beforeLabel: string;
    afterLabel: string;
    labelBg: string;
    labelColor: string;
    showCta: boolean;
    ctaText: string;
    ctaStyle: CtaStyle;
    ctaBg: string;
    ctaColor: string;
    logoImage: string;
    logoPositionX: number;
    logoPositionY: number;
    logoZoom: number;
    headline: string;
    caption: string;
    fgColor: string;
    startPositionPct: number;
    hintAnimation: boolean;
    hintLoop: boolean;
    sweepDurationMs: number;
    beforeDestinationUrl: string;
    afterDestinationUrl: string;
    animateZoom: boolean;
    zoomLevel: number;
    zoomDuration: number;
}

export type VideoDisplayAdSize = '300x250' | '336x280' | '300x600' | '970x250';

export interface VideoDisplayAdData {
  size: VideoDisplayAdSize;
  destinationUrl: string;
  videoContent: string;
  imageContent: string;
}


export interface CarouselSlide {
    id: string;
    image: string;
    headline: string;
    caption: string;
    destinationUrl: string;
}
  
export type CarouselAdSize = '300x250' | '336x280' | '300x600';
  
export interface CarouselAdData {
    size: CarouselAdSize;
    slides: CarouselSlide[];
    ctaText: string;
    ctaColor: string;
    ctaBgColor: string;
    progressBarColor: string;
    autoPlay: boolean;
    playDuration: number;
}

export type CubeAdSize = '300x250' | '336x280';

export interface CubeAdData {
  size: CubeAdSize;
  frontImage: string;
  sideImage: string;
  destinationUrl: string;
  rotationSpeed: number; // in seconds
}
