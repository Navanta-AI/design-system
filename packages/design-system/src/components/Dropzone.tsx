"use client"
import React, { forwardRef, useState, useRef, useCallback } from 'react';
import { UploadSimple, File, X } from '@phosphor-icons/react';
import { cn } from '../utils/cn';

export interface DropzoneFile {
  file: File;
  id: string;
}

export interface DropzoneProps {
  onFilesAdded?: (files: File[]) => void;
  files?: DropzoneFile[];
  onFileRemove?: (id: string) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${units[i]}`;
}

let idCounter = 0;
function uid() {
  return `dz-${++idCounter}-${Date.now()}`;
}

const Dropzone = forwardRef<HTMLDivElement, DropzoneProps>(
  (
    {
      onFilesAdded,
      files = [],
      onFileRemove,
      multiple = true,
      accept,
      maxSize,
      disabled = false,
      label = 'Click or drag files to upload',
      description,
      className,
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const dragCounter = useRef(0);

    const validateFiles = useCallback(
      (fileList: File[]): File[] => {
        setError(null);
        return fileList.filter((f) => {
          if (maxSize && f.size > maxSize) {
            setError(`File "${f.name}" exceeds ${formatSize(maxSize)} limit`);
            return false;
          }
          return true;
        });
      },
      [maxSize]
    );

    const handleFiles = useCallback(
      (fileList: FileList | null) => {
        if (!fileList) return;
        const arr = Array.from(fileList);
        const valid = validateFiles(arr);
        if (valid.length > 0) onFilesAdded?.(valid);
      },
      [onFilesAdded, validateFiles]
    );

    const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault();
      dragCounter.current++;
      if (dragCounter.current === 1) setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      dragCounter.current--;
      if (dragCounter.current === 0) setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsDragging(false);
      if (!disabled) handleFiles(e.dataTransfer.files);
    };

    const handleClick = () => {
      if (!disabled) inputRef.current?.click();
    };

    return (
      <div ref={ref} className={cn('w-full', className)}>
        <div
          className={cn(
            'flex flex-col items-center justify-center gap-1.5 px-6 py-8 border-2 border-dashed border-border rounded-md bg-secondary cursor-pointer transition-colors outline-none focus-visible:ring-1 focus-visible:ring-ring',
            isDragging ? 'border-primary bg-muted/50 shadow-[0_0_0_3px_rgba(100,64,182,0.1)]' : 'hover:border-primary hover:bg-muted/50',
            disabled && 'opacity-50 cursor-not-allowed hover:border-border hover:bg-secondary'
          )}
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled || undefined}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick();
            }
          }}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            multiple={multiple}
            accept={accept}
            onChange={(e) => handleFiles(e.target.files)}
            disabled={disabled}
            tabIndex={-1}
          />
          <UploadSimple 
            size={24} 
            weight="regular" 
            className={cn('transition-colors', isDragging ? 'text-primary' : 'text-muted-foreground')} 
          />
          <span className="text-center text-[14px] font-medium leading-5 text-foreground">{label}</span>
          {description && (
            <span className="max-w-[420px] text-center text-[12px] leading-[1.35] text-muted-foreground">
              {description}
            </span>
          )}
        </div>

        {error && <span className="block mt-1.5 text-xs text-red-500">{error}</span>}

        {files.length > 0 && (
          <ul className="list-none mt-2 p-0 flex flex-col gap-1">
            {files.map((f) => (
              <li key={f.id} className="flex items-center gap-2 p-2 px-4 bg-secondary border border-border/50 rounded-md">
                <File size={16} weight="regular" className="shrink-0 text-muted-foreground" />
                <span className="flex-1 min-w-0 text-sm text-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                  {f.file.name}
                </span>
                <span className="shrink-0 text-xs font-mono text-muted-foreground">
                  {formatSize(f.file.size)}
                </span>
                {onFileRemove && (
                  <button
                    type="button"
                    className="flex items-center justify-center w-[22px] h-[22px] shrink-0 border-none rounded-sm bg-transparent text-muted-foreground cursor-pointer transition-colors hover:bg-muted/50 hover:text-red-500 focus-visible:ring-1 focus-visible:ring-ring outline-none"
                    onClick={() => onFileRemove(f.id)}
                    aria-label={`Remove ${f.file.name}`}
                  >
                    <X size={12} weight="bold" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);

Dropzone.displayName = 'Dropzone';
export { uid as dropzoneUid };
export { Dropzone };
export default Dropzone;
