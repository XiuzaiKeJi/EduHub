import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { uploadToStorage, deleteFromStorage } from '@/lib/storage';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('未授权', { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return new NextResponse('未提供文件', { status: 400 });
    }

    // 验证文件类型
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.type)) {
      return new NextResponse('不支持的文件类型', { status: 400 });
    }

    // 验证文件大小（10MB）
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return new NextResponse('文件过大', { status: 400 });
    }

    // 上传文件到存储
    const fileUrl = await uploadToStorage(file, `courses/${params.id}`);

    // 保存文件信息到数据库
    const courseFile = await prisma.courseFile.create({
      data: {
        name: file.name,
        type: file.type,
        size: file.size,
        url: fileUrl,
        courseId: params.id,
      },
    });

    return NextResponse.json(courseFile);
  } catch (error) {
    console.error('文件上传错误:', error);
    return new NextResponse('文件上传失败', { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('未授权', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('fileId');
    if (!fileId) {
      return new NextResponse('未提供文件ID', { status: 400 });
    }

    // 获取文件信息
    const file = await prisma.courseFile.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return new NextResponse('文件不存在', { status: 404 });
    }

    // 从存储中删除文件
    await deleteFromStorage(file.url);

    // 从数据库中删除文件记录
    await prisma.courseFile.delete({
      where: { id: fileId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('文件删除错误:', error);
    return new NextResponse('文件删除失败', { status: 500 });
  }
} 