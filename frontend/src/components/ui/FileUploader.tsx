import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, X, Loader2, CheckCircle2 } from 'lucide-react';
import { uploadService, UploadResult } from '../../services/uploadService';
import { useToast } from '../../context/ToastContext';

interface FileUploaderProps {
  onUploadSuccess: (attachment: UploadResult | null) => void;
  value?: UploadResult | null;
  className?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onUploadSuccess,
  value = null,
  className = '',
}) => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<UploadResult | null>(value);

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
  const maxSizeBytes = 5 * 1024 * 1024; // 5MB

  const handleFile = async (file: File) => {
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Only JPG, PNG, WEBP, and PDF are allowed.');
      return;
    }

    if (file.size > maxSizeBytes) {
      toast.error('File size exceeds the 5MB maximum limit.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(40);
      
      const result = await uploadService.uploadFile(file);
      setUploadProgress(100);
      setUploadedFile(result);
      onUploadSuccess(result);
      toast.success('File uploaded successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload file');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    setUploadedFile(null);
    onUploadSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        accept=".jpg,.jpeg,.png,.webp,.pdf"
        className="hidden"
      />

      {uploadedFile ? (
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center gap-3 min-w-0">
            {uploadedFile.fileType.includes('image') ? (
              <div className="relative w-12 h-12 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0 border border-slate-300">
                <img
                  src={uploadedFile.fileUrl}
                  alt={uploadedFile.fileName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-xs">
                  {uploadedFile.fileName}
                </p>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              </div>
              <p className="text-xs text-slate-500">{formatFileSize(uploadedFile.fileSize)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50/50'
              : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-xs font-semibold text-slate-700">Uploading attachment...</p>
              <div className="w-40 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="p-3 bg-white rounded-full shadow-subtle border border-slate-200 text-blue-600 mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                Click to upload or drag & drop
              </p>
              <p className="text-xs text-slate-500 mt-1">
                JPG, PNG, WEBP, or PDF (Max 5MB)
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};
