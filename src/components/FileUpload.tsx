
import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, FileType, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface FileUploadProps {
  onFileProcessed: (days: number) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileProcessed }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension) {
      setError("Unable to determine file type");
      return;
    }
    
    if (fileExtension !== 'csv' && fileExtension !== 'xlsx') {
      setError("Please upload a .csv or .xlsx file");
      return;
    }
    
    setFile(file);
    toast({
      title: "File uploaded successfully",
      description: `${file.name} is ready for processing.`,
      duration: 3000,
    });
  };

  const handleSubmit = () => {
    if (!file) {
      setError("Please upload a file before submitting");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate processing time
    setTimeout(() => {
      // Generate random number of days between 2-5
      const days = Math.floor(Math.random() * 4) + 2;
      onFileProcessed(days);
      setIsLoading(false);
    }, 1500);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">
      <h3 className="text-xl font-semibold mb-4 text-center text-solar-darkGray">
        Upload Your Data File
      </h3>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 transition-all ${
          isDragging 
            ? 'border-solar-green bg-solar-green/5' 
            : file 
              ? 'border-solar-blue bg-solar-blue/5' 
              : 'border-gray-300 hover:border-solar-yellow hover:bg-solar-yellow/5'
        } flex flex-col items-center justify-center cursor-pointer`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv,.xlsx"
          className="hidden"
        />
        
        <Upload 
          size={48} 
          className={`mb-4 ${file ? 'text-solar-blue' : 'text-gray-400'}`} 
        />
        
        {file ? (
          <div className="text-center animate-fade-in">
            <p className="font-medium text-solar-darkGray mb-2">File ready:</p>
            <p className="text-solar-blue font-bold">{file.name}</p>
            <p className="text-sm text-gray-500 mt-1">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="font-medium text-solar-darkGray mb-2">
              Drag & drop your file here
            </p>
            <p className="text-sm text-gray-500 mb-4">
              or click to browse (.csv, .xlsx)
            </p>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white hover:bg-solar-yellow/10 border-solar-yellow text-solar-darkGray"
              onClick={(e) => {
                e.stopPropagation();
                triggerFileInput();
              }}
            >
              Browse Files
            </Button>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-md animate-fade-in">
          <AlertCircle size={18} />
          <p>{error}</p>
        </div>
      )}
      
      <div className="mt-6 flex justify-center">
        <Button 
          onClick={handleSubmit}
          disabled={!file || isLoading}
          className="bg-solar-green hover:bg-solar-green/90 text-white px-8 py-2"
        >
          {isLoading ? "Processing..." : "Submit for Analysis"}
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
