
import React, { useRef } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  previewUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, previewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageSelect(event.target.files[0]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      onImageSelect(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="w-full h-80 border-2 border-dashed border-green-300 rounded-lg flex justify-center items-center cursor-pointer bg-green-50 hover:bg-green-100 transition-colors duration-300 overflow-hidden"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      {previewUrl ? (
        <img src={previewUrl} alt="Plant preview" className="h-full w-full object-cover" />
      ) : (
        <div className="text-center text-green-600">
          <UploadIcon className="mx-auto h-12 w-12" />
          <p className="mt-2 font-semibold">Click to upload or drag and drop</p>
          <p className="text-sm text-green-500">PNG, JPG, or WEBP</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
