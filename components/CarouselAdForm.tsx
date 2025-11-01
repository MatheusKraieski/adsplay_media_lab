import React from 'react';
import { CarouselAdData, CarouselSlide, CarouselAdSize } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Input, Select, Toggle, ColorPicker, Range, FileUpload } from './FormControls';
import { TrashIcon } from './icons/TrashIcon';
import { UploadIcon } from './icons/UploadIcon';

interface CarouselAdFormProps {
  adData: CarouselAdData;
  updateAdData: (field: keyof CarouselAdData, value: any) => void;
  onUpdateSlide: (id: string, field: keyof CarouselSlide, value: any) => void;
  onDeleteSlide: (id: string) => void;
  onAddSlide: () => void;
  onImageUpload: (id: string, file: File) => void;
  onExport: () => void;
}

const FormSection: React.FC<{ title: string, children: React.ReactNode, className?: string }> = ({ title, children, className }) => (
    <div className={`space-y-4 ${className}`}>
        <div className="flex items-center">
            <h4 className="text-sm font-semibold text-purple-400 mr-4 whitespace-nowrap">{title}</h4>
            <hr className="w-full border-t border-gray-700" />
        </div>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const CarouselAdForm: React.FC<CarouselAdFormProps> = ({ 
    adData, 
    updateAdData,
    onUpdateSlide,
    onDeleteSlide,
    onAddSlide,
    onImageUpload,
    onExport
}) => {
  const { t } = useLanguage();

  const handleNumericChange = (field: keyof CarouselAdData, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      updateAdData(field, numValue);
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 space-y-6">
      <FormSection title={t('form.carousel.section.general')}>
        <Select label={t('form.size')} value={adData.size} onChange={(e) => updateAdData('size', e.target.value as CarouselAdSize)}>
            <option value="300x250">300x250</option>
            <option value="336x280">336x280</option>
            <option value="300x600">300x600</option>
        </Select>
        <Input label={t('form.carousel.ctaText')} value={adData.ctaText} onChange={(e) => updateAdData('ctaText', e.target.value)} />
        <ColorPicker label={t('form.carousel.ctaBgColor')} value={adData.ctaBgColor} onChange={(c) => updateAdData('ctaBgColor', c)} />
        <ColorPicker label={t('form.carousel.ctaColor')} value={adData.ctaColor} onChange={(c) => updateAdData('ctaColor', c)} />
        <ColorPicker label={t('form.carousel.progressBarColor')} value={adData.progressBarColor} onChange={(c) => updateAdData('progressBarColor', c)} />
        <Toggle label={t('form.carousel.autoPlay')} enabled={adData.autoPlay} onChange={(v) => updateAdData('autoPlay', v)} />
        <Range label={t('form.carousel.playDuration')} unit="s" min={1} max={15} value={adData.playDuration} onChange={(e) => handleNumericChange('playDuration', e.target.value)} disabled={!adData.autoPlay} />
      </FormSection>

      <FormSection title={t('form.carousel.section.slides')}>
        <div className="space-y-4">
            {adData.slides.map((slide, index) => (
                <div key={slide.id} className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <h5 className="font-bold text-gray-300">{t('form.carousel.slide')} {index + 1}</h5>
                        <button 
                            onClick={() => onDeleteSlide(slide.id)} 
                            disabled={adData.slides.length <= 1}
                            className="text-gray-400 hover:text-red-500 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                        >
                            <TrashIcon />
                        </button>
                    </div>
                    <FileUpload 
                        id={`slide-upload-${slide.id}`}
                        label={t('form.slider.v2.uploadImage')} 
                        onChange={(f) => onImageUpload(slide.id, f)}
                        buttonText={t('form.upload')}
                        accept="image/*"
                    />
                    <Input label={t('form.carousel.headline')} value={slide.headline} onChange={(e) => onUpdateSlide(slide.id, 'headline', e.target.value)} />
                    <Input label={t('form.carousel.caption')} value={slide.caption} onChange={(e) => onUpdateSlide(slide.id, 'caption', e.target.value)} />
                    <Input label={t('form.destinationUrl')} type="url" value={slide.destinationUrl} onChange={(e) => onUpdateSlide(slide.id, 'destinationUrl', e.target.value)} />
                </div>
            ))}
        </div>
        <button onClick={onAddSlide} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
            {t('form.carousel.addSlide')}
        </button>
      </FormSection>

      <button onClick={onExport} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
        {t('form.carousel.exportHtml')}
      </button>
    </div>
  );
};

export default CarouselAdForm;
