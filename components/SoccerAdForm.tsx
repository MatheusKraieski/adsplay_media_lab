import React from 'react';
import { VideoDisplayAdData, VideoDisplayAdSize } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Input, Select, FileUpload } from './FormControls';

interface VideoDisplayAdFormProps {
  adData: VideoDisplayAdData;
  updateAdData: (field: keyof VideoDisplayAdData, value: any) => void;
  onExport: () => void;
  onVideoUpload: (file: File) => void;
  onImageUpload: (file: File) => void;
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

const imageSizeHints: Record<VideoDisplayAdSize, string> = {
    '970x250': '526px x 250px',
    '300x600': '300px x 431px',
    '336x280': '336px x 91px',
    '300x250': '300px x 81px',
};

const VideoDisplayAdForm: React.FC<VideoDisplayAdFormProps> = ({ 
    adData, 
    updateAdData, 
    onExport,
    onVideoUpload,
    onImageUpload
}) => {
  const { t } = useLanguage();
  const hint = imageSizeHints[adData.size];

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 space-y-6">
      
      <FormSection title={t('form.soccer.section.general')}>
        <Select label={t('form.size')} value={adData.size} onChange={(e) => updateAdData('size', e.target.value as VideoDisplayAdSize)}>
            <option value="970x250">970x250</option>
            <option value="300x600">300x600</option>
            <option value="336x280">336x280</option>
            <option value="300x250">300x250</option>
        </Select>
        <Input label={t('form.destinationUrl')} type="url" value={adData.destinationUrl} onChange={(e) => updateAdData('destinationUrl', e.target.value)} />
      </FormSection>

      <FormSection title={t('form.soccer.section.assets')}>
        <FileUpload id="video-upload" label={t('form.soccer.uploadVideo')} onChange={onVideoUpload} buttonText={t('form.upload')} accept="video/*" />
        <FileUpload id="image-upload" label={t('form.soccer.uploadImage')} onChange={onImageUpload} buttonText={t('form.upload')} accept="image/*" />
        {hint && <p className="text-xs text-gray-400 -mt-2">{t('form.soccer.imageHint').replace('{size}', hint)}</p>}
      </FormSection>

      <button onClick={onExport} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
        {t('form.soccer.exportHtml')}
      </button>
    </div>
  );
};

export default VideoDisplayAdForm;
