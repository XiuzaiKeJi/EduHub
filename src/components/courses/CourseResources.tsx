import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { File, FileText, Image, Download, Eye } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface CourseResourcesProps {
  resources: {
    id: string;
    name: string;
    type: string;
    url: string;
    description: string | null;
    createdAt: Date;
  }[];
}

export function CourseResources({ resources }: CourseResourcesProps) {
  const [previewResource, setPreviewResource] = useState<typeof resources[0] | null>(null);

  const getResourceIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-500" />;
    } else if (type === 'application/pdf') {
      return <FileText className="h-5 w-5 text-red-500" />;
    }
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const handlePreview = (resource: typeof resources[0]) => {
    setPreviewResource(resource);
  };

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  const renderPreview = () => {
    if (!previewResource) return null;

    if (previewResource.type.startsWith('image/')) {
      return (
        <img
          src={previewResource.url}
          alt={previewResource.name}
          className="max-w-full max-h-[80vh] object-contain"
        />
      );
    } else if (previewResource.type === 'application/pdf') {
      return (
        <iframe
          src={previewResource.url}
          className="w-full h-[80vh]"
          title={previewResource.name}
        />
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <p className="text-gray-500">该文件类型暂不支持预览</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => handleDownload(previewResource.url)}
        >
          下载查看
        </Button>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>课程资源</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {getResourceIcon(resource.type)}
                <div>
                  <h4 className="font-medium">{resource.name}</h4>
                  {resource.description && (
                    <p className="text-sm text-gray-500">{resource.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePreview(resource)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDownload(resource.url)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={!!previewResource} onOpenChange={() => setPreviewResource(null)}>
          <DialogContent className="max-w-4xl">
            <div className="mt-4">{renderPreview()}</div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
} 