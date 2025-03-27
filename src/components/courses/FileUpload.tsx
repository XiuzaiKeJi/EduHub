import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  onDelete: (fileId: string) => Promise<void>;
  maxSize?: number; // 单位：MB
  accept?: Record<string, string[]>;
  maxFiles?: number;
}

export function FileUpload({
  onUpload,
  onDelete,
  maxSize = 10,
  accept = {
    'application/pdf': ['.pdf'],
    'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  },
  maxFiles = 1,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: '文件过大',
          description: `文件大小不能超过 ${maxSize}MB`,
          variant: 'destructive',
        });
        return;
      }

      setUploading(true);
      setProgress(0);
      setFiles(acceptedFiles);

      try {
        await onUpload(file);
        toast({
          title: '上传成功',
          description: '文件已成功上传',
        });
      } catch (error) {
        toast({
          title: '上传失败',
          description: '文件上传失败，请重试',
          variant: 'destructive',
        });
      } finally {
        setUploading(false);
        setProgress(100);
      }
    },
    [maxSize, onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    disabled: uploading,
  });

  const handleDelete = async (fileId: string) => {
    try {
      await onDelete(fileId);
      setFiles([]);
      setProgress(0);
      toast({
        title: '删除成功',
        description: '文件已成功删除',
      });
    } catch (error) {
      toast({
        title: '删除失败',
        description: '文件删除失败，请重试',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-gray-500">正在上传...</p>
            <Progress value={progress} className="w-full max-w-xs" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-500">
              {isDragActive
                ? '释放文件以上传'
                : `拖拽文件到此处，或点击选择文件（最大 ${maxSize}MB）`}
            </p>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <File className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">{file.name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(file.name)}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 