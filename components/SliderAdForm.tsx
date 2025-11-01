import React from 'react';
import { SliderAdData, AdSize, SliderHandleStyle, LabelStyle, CtaStyle, AdTemplate } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Input, Select, Toggle, ColorPicker, Range, FileUpload } from './FormControls';

interface SliderAdFormProps {
  adData: SliderAdData;
  updateAdData: (field: keyof SliderAdData, value: any) => void;
  onExport: () => void;
  onGifExport: () => void;
  onBeforeImageUpload: (file: File) => void;
  onAfterImageUpload: (file: File) => void;
  onLogoUpload: (file: File) => void;
}

const FormSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-4">
        <div className="flex items-center">
            <h4 className="text-sm font-semibold text-purple-400 mr-4 whitespace-nowrap">{title}</h4>
            <hr className="w-full border-t border-gray-700" />
        </div>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const SliderAdForm: React.FC<SliderAdFormProps> = ({ 
    adData, 
    updateAdData, 
    onExport, 
    onGifExport,
    onBeforeImageUpload,
    onAfterImageUpload,
    onLogoUpload
}) => {
  const { t } = useLanguage();

  const handleNumericChange = (field: keyof SliderAdData, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      updateAdData(field, numValue);
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 space-y-6">
      
      <FormSection title={t('form.slider.v2.section.sizeAndMedia')}>
        <Select label={t('form.size')} value={adData.size} onChange={(e) => updateAdData('size', e.target.value as AdSize)}>
            <option value="336x280">336x280</option>
            <option value="300x250">300x250</option>
            <option value="300x600">300x600</option>
            <option value="160x600">160x600</option>
            <option value="728x90">728x90</option>
        </Select>

        <Select label={t('form.slider.v2.template')} value={adData.template} onChange={(e) => updateAdData('template', e.target.value as AdTemplate)}>
            <option value="classic">{t('form.slider.v2.template.classic')}</option>
            <option value="modern">{t('form.slider.v2.template.modern')}</option>
        </Select>
        
        <Input label={t('form.slider.v2.beforeImageUrl')} type="url" value={adData.beforeImage} onChange={(e) => updateAdData('beforeImage', e.target.value)} />
        <div className="flex items-center py-1">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-xs uppercase">{t('form.or')}</span>
            <div className="flex-grow border-t border-gray-700"></div>
        </div>
        <FileUpload
            id="before-image-upload"
            label={t('form.slider.v2.uploadImage')}
            onChange={onBeforeImageUpload}
            buttonText={t('form.upload')}
            accept="image/*"
        />

        <hr className="border-gray-700/50 !my-6" />

        <Input label={t('form.slider.v2.afterImageUrl')} type="url" value={adData.afterImage} onChange={(e) => updateAdData('afterImage', e.target.value)} />
        <div className="flex items-center py-1">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-xs uppercase">{t('form.or')}</span>
            <div className="flex-grow border-t border-gray-700"></div>
        </div>
        <FileUpload
            id="after-image-upload"
            label={t('form.slider.v2.uploadImage')}
            onChange={onAfterImageUpload}
            buttonText={t('form.upload')}
            accept="image/*"
        />
      </FormSection>

      <FormSection title={t('form.slider.v2.section.slider')}>
        <Select label={t('form.slider.v2.handleStyle')} value={adData.handleStyle} onChange={(e) => updateAdData('handleStyle', e.target.value as SliderHandleStyle)}>
            <option value="circle">Circle</option><option value="pill">Pill</option><option value="line">Line</option>
        </Select>
        <Select label={t('form.slider.v2.handleIcon')} value={adData.handleIcon} onChange={(e) => updateAdData('handleIcon', e.target.value as SliderAdData['handleIcon'])}>
            <option value="arrows">Arrows</option><option value="drag">Drag</option><option value="none">None</option>
        </Select>
        <Range label={t('form.slider.v2.handleThickness')} unit="px" min={1} max={10} value={adData.handleThickness} onChange={(e) => handleNumericChange('handleThickness', e.target.value)} />
        <ColorPicker label={t('form.slider.v2.dividerColor')} value={adData.dividerColor} onChange={(c) => updateAdData('dividerColor', c)} />
        <Range label={t('form.slider.v2.dividerWidth')} unit="px" min={0} max={10} value={adData.dividerWidth} onChange={(e) => handleNumericChange('dividerWidth', e.target.value)} />
      </FormSection>

      <FormSection title={t('form.slider.v2.section.labels')}>
        <Toggle label={t('form.slider.v2.showLabels')} enabled={adData.showLabels} onChange={(v) => updateAdData('showLabels', v)} />
        <Select label={t('form.slider.v2.labelStyle')} value={adData.labelStyle} onChange={(e) => updateAdData('labelStyle', e.target.value as LabelStyle)} disabled={!adData.showLabels}>
            <option value="pill">Pill</option><option value="tag">Tag</option><option value="badge">Badge</option><option value="none">None</option>
        </Select>
        <Input label={t('form.slider.v2.beforeLabel')} value={adData.beforeLabel} onChange={(e) => updateAdData('beforeLabel', e.target.value)} disabled={!adData.showLabels} />
        <Input label={t('form.slider.v2.afterLabel')} value={adData.afterLabel} onChange={(e) => updateAdData('afterLabel', e.target.value)} disabled={!adData.showLabels} />
        <ColorPicker label={t('form.slider.v2.labelBg')} value={adData.labelBg} onChange={(c) => updateAdData('labelBg', c)} disabled={!adData.showLabels} />
        <ColorPicker label={t('form.slider.v2.labelColor')} value={adData.labelColor} onChange={(c) => updateAdData('labelColor', c)} disabled={!adData.showLabels} />
      </FormSection>
      
      <FormSection title={t('form.slider.v2.section.branding')}>
        <FileUpload
            id="logo-image-upload"
            label={t('form.slider.v2.uploadLogo')}
            onChange={onLogoUpload}
            buttonText={t('form.upload')}
            accept="image/*,.svg"
        />
        <Range label={t('form.slider.v2.logoPositionX')} unit="%" min={0} max={100} value={adData.logoPositionX} onChange={(e) => handleNumericChange('logoPositionX', e.target.value)} />
        <Range label={t('form.slider.v2.logoPositionY')} unit="%" min={0} max={100} value={adData.logoPositionY} onChange={(e) => handleNumericChange('logoPositionY', e.target.value)} />
        <Range label={t('form.slider.v2.logoZoom')} unit="%" min={20} max={200} value={adData.logoZoom} onChange={(e) => handleNumericChange('logoZoom', e.target.value)} />
      </FormSection>
      
      <FormSection title={t('form.slider.v2.section.cta')}>
        <Toggle label={t('form.slider.v2.showCta')} enabled={adData.showCta} onChange={(v) => updateAdData('showCta', v)} />
        <Input label={t('form.slider.v2.ctaText')} value={adData.ctaText} onChange={(e) => updateAdData('ctaText', e.target.value)} disabled={!adData.showCta} />
        <Select label={t('form.slider.v2.ctaStyle')} value={adData.ctaStyle} onChange={(e) => updateAdData('ctaStyle', e.target.value as CtaStyle)} disabled={!adData.showCta}>
            <option value="solid">Solid</option><option value="ghost">Ghost</option><option value="glass">Glass</option>
        </Select>
        <ColorPicker label={t('form.slider.v2.ctaBg')} value={adData.ctaBg} onChange={(c) => updateAdData('ctaBg', c)} disabled={!adData.showCta} />
        <ColorPicker label={t('form.slider.v2.ctaColor')} value={adData.ctaColor} onChange={(c) => updateAdData('ctaColor', c)} disabled={!adData.showCta} />
      </FormSection>

      <FormSection title={t('form.slider.v2.section.text')}>
        <Input label={t('form.slider.v2.headline')} value={adData.headline} onChange={(e) => updateAdData('headline', e.target.value)} />
        <Input label={t('form.slider.v2.caption')} value={adData.caption} onChange={(e) => updateAdData('caption', e.target.value)} />
        <ColorPicker label={t('form.slider.v2.fgColor')} value={adData.fgColor} onChange={(c) => updateAdData('fgColor', c)} />
      </FormSection>

      <FormSection title={t('form.slider.v2.section.interaction')}>
        <Range label={t('form.slider.v2.startPosition')} unit="%" min={0} max={100} value={adData.startPositionPct} onChange={(e) => handleNumericChange('startPositionPct', e.target.value)} />
        <Toggle label={t('form.slider.v2.hintAnimation')} enabled={adData.hintAnimation} onChange={(v) => updateAdData('hintAnimation', v)} />
        <Toggle label={t('form.slider.v2.hintLoop')} enabled={adData.hintLoop} onChange={(v) => updateAdData('hintLoop', v)} disabled={!adData.hintAnimation} />
        <Input label={t('form.slider.v2.sweepDuration')} type="number" value={adData.sweepDurationMs} onChange={(e) => handleNumericChange('sweepDurationMs', e.target.value)} disabled={!adData.hintAnimation} />
        <hr className="border-gray-700/50 !my-4" />
        <Toggle label={t('form.slider.v2.animateZoom')} enabled={adData.animateZoom} onChange={(v) => updateAdData('animateZoom', v)} />
        <Range label={t('form.slider.v2.zoomLevel')} unit="%" min={100} max={200} value={adData.zoomLevel} onChange={(e) => handleNumericChange('zoomLevel', e.target.value)} />
        <Input label={t('form.slider.v2.zoomDuration')} type="number" min={1} value={adData.zoomDuration} onChange={(e) => handleNumericChange('zoomDuration', e.target.value)} disabled={!adData.animateZoom} />
      </FormSection>

      <FormSection title={t('form.slider.v2.section.export')}>
        <Input label={t('form.slider.v2.beforeDestinationUrl')} type="url" value={adData.beforeDestinationUrl} onChange={(e) => updateAdData('beforeDestinationUrl', e.target.value)} />
        <Input label={t('form.slider.v2.afterDestinationUrl')} type="url" value={adData.afterDestinationUrl} onChange={(e) => updateAdData('afterDestinationUrl', e.target.value)} />
        <button onClick={onExport} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors">{t('form.slider.v2.exportHtml')}</button>
        <button onClick={onGifExport} disabled={!adData.hintAnimation} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">{t('form.slider.v2.exportGif')}</button>
      </FormSection>
    </div>
  );
};

export default SliderAdForm;
