import { FC, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card } from '@/components/ui/card'
import { X, File, FileText, Image, Video, Music } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FileWithProgress extends File {
  progress?: number
  preview?: string
}

interface FileUploadProps {
  onFilesSelected: (files: FileWithProgress[]) => void
  onFileRemove: (file: FileWithProgress) => void
  maxSize?: number // 单位：MB
  accept?: Record<string, string[]>
  maxFiles?: number
  className?: string
}

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ACCEPTED_FILE_TYPES = {
  'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'video/*': ['.mp4', '.avi', '.mov'],
  'audio/*': ['.mp3', '.wav', '.ogg'],
}

export const FileUpload: FC<FileUploadProps> = ({
  onFilesSelected,
  onFileRemove,
  maxSize = MAX_FILE_SIZE,
  accept = ACCEPTED_FILE_TYPES,
  maxFiles = 10,
  className,
}) => {
  const [files, setFiles] = useState<FileWithProgress[]>([])

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => {
      const fileWithProgress: FileWithProgress = file
      if (file.type.startsWith('image/')) {
        fileWithProgress.preview = URL.createObjectURL(file)
      }
      return fileWithProgress
    })

    setFiles(prev => [...prev, ...newFiles])
    onFilesSelected(newFiles)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
  })

  const removeFile = (file: FileWithProgress) => {
    setFiles(prev => prev.filter(f => f !== file))
    onFileRemove(file)
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-4 w-4" />
    if (file.type.startsWith('video/')) return <Video className="h-4 w-4" />
    if (file.type.startsWith('audio/')) return <Music className="h-4 w-4" />
    return <FileText className="h-4 w-4" />
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        )}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <File className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isDragActive
              ? '将文件拖放到此处'
              : '点击或拖放文件到此处上传'}
          </p>
          <p className="text-xs text-muted-foreground">
            支持的文件类型：图片、PDF、Office文档、视频、音频
          </p>
          <p className="text-xs text-muted-foreground">
            最大文件大小：{maxSize / (1024 * 1024)}MB
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getFileIcon(file)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(file)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {file.progress !== undefined && (
                <Progress value={file.progress} className="mt-2" />
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 