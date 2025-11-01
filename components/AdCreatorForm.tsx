
import React from 'react';
import { AdData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Input, Select, Toggle, FileUpload, ColorPicker } from './FormControls';

interface AdCreatorFormProps {
  adData: AdData;
  updateAdData: (field: keyof AdData, value: any) => void;
  onVideoFileSelect: (file: File) => void;
  onAvatarFileSelect: (file: File) => void;
  onExport: (platform: 'dv360' | 'gam') => void;
}

const AdCreatorForm: React.FC<AdCreatorFormProps> = ({ adData, updateAdData, onVideoFileSelect, onAvatarFileSelect, onExport }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 space-y-6">
      <h3 className="text-xl font-bold">{t('form.title')}</h3>
      <div className="space-y-4">
        <Input 
          label={t('form.videoUrl')} 
          type="url" 
          placeholder={t('form.videoUrlPlaceholder')} 
          value={adData.videoContent || ''}
          onChange={(e) => updateAdData('videoContent', e.target.value)}
        />
        <div className="flex items-center">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-xs uppercase">{t('form.or')}</span>
            <div className="flex-grow border-t border-gray-700"></div>
        </div>
        <FileUpload
            id="video-upload"
            label={t('form.uploadVideo')}
            onChange={onVideoFileSelect}
            buttonText={t('form.upload')}
            accept="video/*"
        />
      </div>

      <hr className="border-gray-700" />
      
      <h3 className="text-xl font-bold">{t('form.settingsTitle')}</h3>
      <div className="space-y-4">
        <Select label={t('form.size')} value={adData.size} onChange={(e) => updateAdData('size', e.target.value as AdData['size'])}>
          <option value="300x250">300x250</option>
          <option value="300x600">300x600</option>
          <option value="336x280">336x280</option>
        </Select>
        <Input label={t('form.brand')} value={adData.brand} onChange={(e) => updateAdData('brand', e.target.value)} />
        <Input label={t('form.caption')} value={adData.captionText} onChange={(e) => updateAdData('captionText', e.target.value)} />
        <Input label={t('form.hashtag')} value={adData.hashtag} onChange={(e) => updateAdData('hashtag', e.target.value)} />
        <Input label={t('form.destinationUrl')} type="url" value={adData.destinationUrl} onChange={(e) => updateAdData('destinationUrl', e.target.value)} />
        <ColorPicker label={t('form.textColor')} value={adData.textColor} onChange={(c) => updateAdData('textColor', c)} />
        <div className="grid grid-cols-2 gap-4">
            <Input label={t('form.likes')} value={adData.likes} onChange={(e) => updateAdData('likes', e.target.value)} />
            <Input label={t('form.comments')} value={adData.comments} onChange={(e) => updateAdData('comments', e.target.value)} />
        </div>
        <Input label={t('form.publisher')} value={adData.publisher} onChange={(e) => updateAdData('publisher', e.target.value)} />
        <Toggle label={t('form.verified')} enabled={adData.isVerified} onChange={(v) => updateAdData('isVerified', v)} />
        
        <FileUpload
            id="avatar-upload"
            label={t('form.avatar')}
            onChange={onAvatarFileSelect}
            buttonText={t('form.upload')}
            accept="image/*"
        />
      </div>

      <hr className="border-gray-700" />

      <div>
        <h3 className="text-xl font-bold mb-4">{t('form.export.title')}</h3>
        <div className="space-y-2">
            <button onClick={() => onExport('dv360')} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                {t('form.export.html_dv360')}
            </button>
            <button onClick={() => onExport('gam')} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                {t('form.export.html_gam')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdCreatorForm;
