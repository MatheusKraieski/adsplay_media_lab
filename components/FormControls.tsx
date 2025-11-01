import React, { ChangeEvent } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <input
      {...props}
      className="w-full bg-gray-900/70 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition"
    />
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ label, children, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <select
      {...props}
      className="w-full bg-gray-900/70 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition appearance-none"
    >
      {children}
    </select>
  </div>
);

interface ToggleProps {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({ label, enabled, onChange, disabled }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-gray-300">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      disabled={disabled}
      className={`${
        enabled ? 'bg-purple-600' : 'bg-gray-600'
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <span
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  </div>
);

interface FileUploadProps {
  label: string;
  onChange: (file: File) => void;
  buttonText: string;
  accept?: string;
  id: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, onChange, buttonText, accept, id }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
      e.target.value = ''; // Reset input to allow re-uploading the same file
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <div className="mt-1 flex items-center">
        <label
          htmlFor={id}
          className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
        >
          {buttonText}
        </label>
        <input id={id} name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept={accept} />
      </div>
    </div>
  );
};

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange, disabled }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <div className="relative">
            <input 
                type="color" 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="p-1 h-10 w-full block bg-gray-700 border border-gray-600 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none"
                disabled={disabled}
            />
        </div>
    </div>
);

interface RangeProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    value: number | string;
    unit?: string;
}
  
export const Range: React.FC<RangeProps> = ({ label, value, unit, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label} <span className="text-gray-400">({value}{unit})</span></label>
      <input
        type="range"
        value={value}
        {...props}
        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
      />
    </div>
);