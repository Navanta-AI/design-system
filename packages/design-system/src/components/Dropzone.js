import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiFile, FiX } from 'react-icons/fi';
import styles from '../styles/Dropzone.module.css';

/**
 * Dropzone component for file uploads.
 * 
 * @param {Object} props
 * @param {Function} props.onFilesAdded - Callback when files are dropped or selected.
 * @param {Array} props.files - List of currently selected files.
 * @param {Function} props.onFileRemove - Callback to remove a file.
 * @param {boolean} props.multiple - Allow multiple files.
 * @param {Object} props.accept - Accepted file types (react-dropzone format).
 * @param {number} props.maxSize - Maximum file size in bytes.
 * @param {boolean} props.disabled - Whether interaction is disabled.
 */
export default function Dropzone({
  onFilesAdded,
  files = [],
  onFileRemove,
  multiple = true,
  accept,
  maxSize,
  disabled = false
}) {
  const onDrop = useCallback(acceptedFiles => {
    if (onFilesAdded) onFilesAdded(acceptedFiles);
  }, [onFilesAdded]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    multiple,
    accept,
    maxSize,
    disabled
  });

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={styles.container}>
      <div 
        {...getRootProps()} 
        className={`${styles.dropArea} ${isDragActive ? styles.active : ''} ${isDragReject ? styles.reject : ''} ${disabled ? styles.disabled : ''}`}
      >
        <input {...getInputProps()} />
        <FiUploadCloud className={styles.uploadIcon} />
        <div className={styles.textContainer}>
          <p className={styles.mainText}>
            {isDragActive ? 'Drop files here' : 'Click or drag files to upload'}
          </p>
          <p className={styles.subText}>
            Support for single or bulk upload.
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <ul className={styles.fileList}>
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className={styles.fileItem}>
              <FiFile className={styles.fileIcon} />
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileSize}>{formatSize(file.size)}</span>
              </div>
              {onFileRemove && (
                <button 
                  type="button" 
                  className={styles.removeBtn} 
                  onClick={() => onFileRemove(index)}
                  aria-label="Remove file"
                >
                  <FiX />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
