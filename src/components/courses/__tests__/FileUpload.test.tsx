import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FileUpload } from '../FileUpload';
import { toast } from '@/components/ui/use-toast';

// Mock toast
jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
}));

describe('FileUpload', () => {
  const mockOnUpload = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders upload area', () => {
    render(
      <FileUpload
        onUpload={mockOnUpload}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(/拖拽文件到此处/)).toBeInTheDocument();
  });

  it('handles file drop', async () => {
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    render(
      <FileUpload
        onUpload={mockOnUpload}
        onDelete={mockOnDelete}
      />
    );

    const dropzone = screen.getByText(/拖拽文件到此处/).parentElement!;
    fireEvent.dragOver(dropzone);
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalledWith(file);
    });
  });

  it('shows error for oversized file', async () => {
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 11 * 1024 * 1024 }); // 11MB

    render(
      <FileUpload
        onUpload={mockOnUpload}
        onDelete={mockOnDelete}
        maxSize={10}
      />
    );

    const dropzone = screen.getByText(/拖拽文件到此处/).parentElement!;
    fireEvent.dragOver(dropzone);
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
      },
    });

    expect(toast).toHaveBeenCalledWith({
      title: '文件过大',
      description: '文件大小不能超过 10MB',
      variant: 'destructive',
    });
    expect(mockOnUpload).not.toHaveBeenCalled();
  });

  it('shows error for unsupported file type', async () => {
    const file = new File(['test'], 'test.exe', { type: 'application/x-msdownload' });
    render(
      <FileUpload
        onUpload={mockOnUpload}
        onDelete={mockOnDelete}
      />
    );

    const dropzone = screen.getByText(/拖拽文件到此处/).parentElement!;
    fireEvent.dragOver(dropzone);
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
      },
    });

    expect(toast).toHaveBeenCalledWith({
      title: '上传失败',
      description: '文件上传失败，请重试',
      variant: 'destructive',
    });
    expect(mockOnUpload).not.toHaveBeenCalled();
  });

  it('handles file deletion', async () => {
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    render(
      <FileUpload
        onUpload={mockOnUpload}
        onDelete={mockOnDelete}
      />
    );

    // Upload file
    const dropzone = screen.getByText(/拖拽文件到此处/).parentElement!;
    fireEvent.dragOver(dropzone);
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });

    // Delete file
    const deleteButton = screen.getByRole('button');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith('test.pdf');
      expect(screen.queryByText('test.pdf')).not.toBeInTheDocument();
    });
  });

  it('shows upload progress', async () => {
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    mockOnUpload.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    render(
      <FileUpload
        onUpload={mockOnUpload}
        onDelete={mockOnDelete}
      />
    );

    const dropzone = screen.getByText(/拖拽文件到此处/).parentElement!;
    fireEvent.dragOver(dropzone);
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
      },
    });

    expect(screen.getByText('正在上传...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('正在上传...')).not.toBeInTheDocument();
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });
  });
}); 