import { useState } from 'react';
import { File, Image, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface FilePreviewProps {
  file: {
    id: string;
    name: string;
    type: string;
    url: string;
  };
  onDelete: (fileId: string) => Promise<void>;
}

export function FilePreview({ file, onDelete }: FilePreviewProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const getFileIcon = () => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-8 w-8 text-blue-500" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const renderPreview = () => {
    if (file.type.startsWith('image/')) {
      return (
        <img
          src={file.url}
          alt={file.name}
          className="max-w-full max-h-[80vh] object-contain"
        />
      );
    } else if (file.type === 'application/pdf') {
      return (
        <iframe
          src={file.url}
          className="w-full h-[80vh]"
          title={file.name}
        />
      );
    }
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <p className="text-gray-500">该文件类型暂不支持预览</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.open(file.url, '_blank')}
        >
          下载查看
        </Button>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div
        className="flex items-center gap-2 cursor-pointer flex-1"
        onClick={() => setIsPreviewOpen(true)}
      >
        {getFileIcon()}
        <span className="text-sm text-gray-600 truncate">{file.name}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(file.id)}
      >
        <X className="h-4 w-4" />
      </Button>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <div className="mt-4">{renderPreview()}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 