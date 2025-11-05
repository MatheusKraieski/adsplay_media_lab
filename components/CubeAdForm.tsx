import React from 'react';
import { CubeAdData, CubeAdSize } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Input, Select, Range, FileUpload } from './FormControls';

interface CubeAdFormProps {
  adData: CubeAdData;
  updateAdData: (field: keyof CubeAdData, value: any) => void;
  onExport: (type: 'html' | 'zip') => void;
  onFrontImageUpload: (file: File) => void;
  onSideImageUpload: (file: File) => void;
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


const CubeAdForm: React.FC<CubeAdFormProps> = ({ 
    adData, 
    updateAdData, 
    onExport,
    onFrontImageUpload,
    onSideImageUpload
}) => {
  const { t } = useLanguage();

  const handleNumericChange = (field: keyof CubeAdData, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      updateAdData(field, numValue);
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 space-y-6">
      <FormSection title={t('form.cube.section.general')}>
        <Select label={t('form.size')} value={adData.size} onChange={(e) => updateAdData('size', e.target.value as CubeAdSize)}>
            <option value="300x250">300x250</option>
            <option value="336x280">336x280</option>
        </Select>
        <Input label={t('form.destinationUrl')} type="url" value={adData.destinationUrl} onChange={(e) => updateAdData('destinationUrl', e.target.value)} />
        <Range label={t('form.cube.rotationSpeed')} unit="s" min={2} max={20} value={adData.rotationSpeed} onChange={(e) => handleNumericChange('rotationSpeed', e.target.value)} />
      </FormSection>
      
      <FormSection title={t('form.cube.section.assets')}>
        <Input label={t('form.cube.frontImage')} type="url" value={adData.frontImage} onChange={(e) => updateAdData('frontImage', e.target.value)} />
        <FileUpload id="front-image-upload" label={t('form.cube.uploadImage')} onChange={onFrontImageUpload} buttonText={t('form.upload')} accept="image/*" />

        <hr className="border-gray-700/50 !my-4" />

        <Input label={t('form.cube.sideImage')} type="url" value={adData.sideImage} onChange={(e) => updateAdData('sideImage', e.target.value)} />
        <FileUpload id="side-image-upload" label={t('form.cube.uploadImage')} onChange={onSideImageUpload} buttonText={t('form.upload')} accept="image/*" />
      </FormSection>

      <div className="space-y-2">
        <button onClick={() => onExport('html')} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
            {t('form.cube.exportHtml')}
        </button>
        <button onClick={() => onExport('zip')} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
            {t('form.cube.exportZip')}
        </button>
      </div>
    </div>
  );
};

export default CubeAdForm;