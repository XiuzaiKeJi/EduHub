# 文件上传组件

## 组件说明
文件上传组件用于处理课程资源的文件上传，支持拖放上传、文件类型限制、文件大小限制等功能。

## 组件属性
| 属性名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| onFilesSelected | (files: FileWithProgress[]) => void | 是 | 文件选择回调函数 |
| onFileRemove | (file: FileWithProgress) => void | 是 | 文件删除回调函数 |
| maxSize | number | 否 | 最大文件大小（字节），默认50MB |
| accept | Record<string, string[]> | 否 | 接受的文件类型，默认支持图片、PDF、Office文档、视频、音频 |
| maxFiles | number | 否 | 最大文件数量，默认10个 |
| className | string | 否 | 自定义类名 |

## 支持的文件类型
- 图片：.png, .jpg, .jpeg, .gif
- PDF：.pdf
- Office文档：
  - Word：.doc, .docx
  - Excel：.xls, .xlsx
  - PowerPoint：.ppt, .pptx
- 视频：.mp4, .avi, .mov
- 音频：.mp3, .wav, .ogg

## 使用示例
```tsx
import { FileUpload } from '@/components/course/FileUpload'

export default function CoursePage() {
  const handleFilesSelected = (files: FileWithProgress[]) => {
    // 处理文件选择
    console.log(files)
  }

  const handleFileRemove = (file: FileWithProgress) => {
    // 处理文件删除
    console.log(file)
  }

  return (
    <FileUpload
      onFilesSelected={handleFilesSelected}
      onFileRemove={handleFileRemove}
      maxSize={50 * 1024 * 1024} // 50MB
      maxFiles={10}
    />
  )
}
```

## 注意事项
1. 组件依赖以下库：
   - react-dropzone
   - shadcn/ui 组件库
   - lucide-react
2. 文件限制：
   - 默认最大文件大小为50MB
   - 默认最多上传10个文件
   - 支持的文件类型已在组件中预定义
3. 文件预览：
   - 图片文件会自动生成预览URL
   - 其他类型文件显示对应的图标
4. 上传进度：
   - 支持显示文件上传进度
   - 进度条使用shadcn/ui的Progress组件 