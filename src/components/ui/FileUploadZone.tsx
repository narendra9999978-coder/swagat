import React, { useState, useRef } from 'react';
import { UploadCloud, File, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface UploadedFileItem {
  id: string;
  name: string;
  size: string;
  progress?: number;
  status: 'uploading' | 'completed' | 'error';
}

interface FileUploadZoneProps {
  onFileSelect?: (files: File[]) => void;
  acceptedTypes?: string;
  maxSizeMB?: number;
  className?: string;
  helperText?: string;
}

/**
 * FileUploadZone
 * Curated from: https://ui.watermelon.sh/block/file-upload-1
 * Dark Glassmorphic Drag & Drop File Upload with Animated Micro-Borders
 */
export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileSelect,
  acceptedTypes = '.pdf,.doc,.docx,.png,.jpg',
  maxSizeMB = 15,
  className = '',
  helperText = 'PDF, DOCX or scanned statutory images up to 15MB',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const processFiles = (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return;
    const fileArray = Array.from(incoming);

    const newItems: UploadedFileItem[] = fileArray.map((f, i) => ({
      id: `${Date.now()}-${i}`,
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(2)} MB`,
      status: 'completed',
      progress: 100,
    }));

    setFiles((prev) => [...prev, ...newItems]);
    if (onFileSelect) {
      onFileSelect(fileArray);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Dropzone Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-xl ${
          isDragOver
            ? 'border-sky-400 bg-sky-500/10 scale-[1.01]'
            : 'border-white/15 bg-white/5 hover:bg-white/8 hover:border-white/25'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes}
          className="hidden"
          onChange={(e) => processFiles(e.target.files)}
        />

        <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-sky-400 mb-3 shadow-inner">
          <UploadCloud className="w-6 h-6" />
        </div>

        <div className="text-center">
          <p className="text-xs sm:text-sm font-semibold text-white">
            <span className="text-sky-400 hover:underline">Click to upload</span> or drag and drop
          </p>
          <p className="text-[11px] text-slate-400 mt-1">{helperText}</p>
        </div>
      </div>

      {/* Uploaded File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <File className="w-4 h-4 text-sky-400 shrink-0" />
                  <div className="truncate">
                    <span className="font-medium text-white truncate block">{file.name}</span>
                    <span className="text-[10px] text-slate-400">{file.size}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Ready</span>
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
