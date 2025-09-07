import React, { useState, useRef } from 'react';
import { FaUpload, FaTimes, FaFile, FaImage, FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint } from 'react-icons/fa';
import { filesService } from '../../services/files';
import toast from 'react-hot-toast';

const FileUpload = ({ 
  onUpload, 
  onRemove, 
  multiple = false, 
  accept = '*/*',
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <FaImage className="h-4 w-4 text-blue-500" />;
    if (fileType === 'application/pdf') return <FaFilePdf className="h-4 w-4 text-red-500" />;
    if (fileType.includes('word')) return <FaFileWord className="h-4 w-4 text-blue-600" />;
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return <FaFileExcel className="h-4 w-4 text-green-600" />;
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return <FaFilePowerpoint className="h-4 w-4 text-orange-600" />;
    return <FaFile className="h-4 w-4 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    try {
      filesService.validateFile(file, maxSize);
      return { valid: true };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  };

  const handleFiles = async (fileList) => {
    const fileArray = Array.from(fileList);
    
    // Check file count limit
    if (files.length + fileArray.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate files
    const validFiles = [];
    const invalidFiles = [];

    fileArray.forEach(file => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        invalidFiles.push({ file, error: validation.error });
      }
    });

    // Show errors for invalid files
    invalidFiles.forEach(({ file, error }) => {
      toast.error(`${file.name}: ${error}`);
    });

    if (validFiles.length === 0) return;

    // Add files to state
    const newFiles = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending'
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Upload files
    if (onUpload) {
      setIsUploading(true);
      setUploadProgress(0);

      try {
        if (multiple) {
          const result = await filesService.uploadMultipleFiles(
            validFiles,
            (progress) => setUploadProgress(progress)
          );
          onUpload(result);
        } else {
          const result = await filesService.uploadFile(
            validFiles[0],
            (progress) => setUploadProgress(progress)
          );
          onUpload(result);
        }
        
        // Update file status
        setFiles(prev => prev.map(f => 
          validFiles.some(vf => vf.name === f.name) 
            ? { ...f, status: 'uploaded' }
            : f
        ));
        
        toast.success(`${validFiles.length} file(s) uploaded successfully`);
      } catch (error) {
        toast.error(error.message || 'Upload failed');
        setFiles(prev => prev.map(f => 
          validFiles.some(vf => vf.name === f.name) 
            ? { ...f, status: 'error' }
            : f
        ));
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = e.target.files;
    handleFiles(selectedFiles);
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (onRemove) {
      const file = files.find(f => f.id === fileId);
      onRemove(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          isDragging
            ? 'border-indigo-400 bg-indigo-50'
            : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
        />
        
        <FaUpload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600">
          {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {multiple ? `Up to ${maxFiles} files` : 'Single file'} • Max {formatFileSize(maxSize)}
        </p>
        
        {isUploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {getFileIcon(file.type)}
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {file.status === 'uploaded' && (
                  <span className="text-xs text-green-600 font-medium">Uploaded</span>
                )}
                {file.status === 'error' && (
                  <span className="text-xs text-red-600 font-medium">Error</span>
                )}
                {file.status === 'pending' && (
                  <span className="text-xs text-yellow-600 font-medium">Pending</span>
                )}
                
                <button
                  onClick={() => removeFile(file.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;

