import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Link, 
  Check, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadManagerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

const ImageUploadManager: React.FC<ImageUploadManagerProps> = ({
  value,
  onChange,
  label = "Image",
  accept = "image/*",
  maxSize = 5,
  className
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'Please select a valid image file.';
    }
    
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB.`;
    }
    
    return null;
  };

  const simulateUpload = async (file: File): Promise<string> => {
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // In a real implementation, this would upload to Supabase Storage
    // For now, we'll create a mock URL
    const mockUrl = `https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop`;
    return mockUrl;
  };

  const handleFileSelect = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      toast({
        title: "Upload Error",
        description: error,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const url = await simulateUpload(file);
      onChange(url);
      toast({
        title: "Upload Successful",
        description: "Image has been uploaded successfully.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput('');
      setShowUrlInput(false);
      toast({
        title: "Image URL Added",
        description: "Image URL has been set successfully.",
      });
    }
  };

  const clearImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className={`bg-gray-900 border-gray-800 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          {label}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Image Preview */}
        {value && (
          <div className="relative">
            <img
              src={value}
              alt="Preview"
              className="w-full h-48 object-cover rounded border border-gray-700"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop';
              }}
            />
            <Button
              variant="destructive"
              size="sm"
              onClick={clearImage}
              className="absolute top-2 right-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-electric-cyan" />
              <span className="text-sm text-gray-300">Uploading...</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {/* Upload Area */}
        {!value && !isUploading && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-electric-cyan bg-electric-cyan/10' 
                : 'border-gray-700 hover:border-gray-600'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-300 mb-2">
              Drag and drop an image here, or click to select
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supports: JPG, PNG, GIF, WebP (max {maxSize}MB)
            </p>
            
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <Link className="w-4 h-4 mr-2" />
                Use URL
              </Button>
            </div>
          </div>
        )}

        {/* URL Input */}
        {showUrlInput && (
          <div className="space-y-2">
            <Label className="text-gray-300">Image URL</Label>
            <div className="flex gap-2">
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="bg-gray-800 border-gray-700 text-white"
                onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
              />
              <Button
                onClick={handleUrlSubmit}
                disabled={!urlInput.trim()}
                className="bg-electric-cyan text-dark hover:bg-electric-cyan/90"
              >
                <Check className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Help Text */}
        <Alert className="bg-gray-800 border-gray-700">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-gray-300">
            <strong>Tip:</strong> For best results, use images with a 16:9 aspect ratio (1200x675px) 
            for featured images, or square images (800x800px) for thumbnails.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default ImageUploadManager;