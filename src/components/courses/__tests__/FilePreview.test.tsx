import { render, screen, fireEvent } from '@testing-library/react';
import { FilePreview } from '../FilePreview';

describe('FilePreview', () => {
  const mockFile = {
    id: '1',
    name: 'test.pdf',
    type: 'application/pdf',
    url: 'https://example.com/test.pdf',
  };

  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders file preview with correct icon and name', () => {
    render(
      <FilePreview
        file={mockFile}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows correct icon for different file types', () => {
    const imageFile = {
      ...mockFile,
      type: 'image/jpeg',
    };

    const { rerender } = render(
      <FilePreview
        file={imageFile}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByTestId('image-icon')).toBeInTheDocument();

    const pdfFile = {
      ...mockFile,
      type: 'application/pdf',
    };

    rerender(
      <FilePreview
        file={pdfFile}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByTestId('pdf-icon')).toBeInTheDocument();

    const otherFile = {
      ...mockFile,
      type: 'application/octet-stream',
    };

    rerender(
      <FilePreview
        file={otherFile}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByTestId('file-icon')).toBeInTheDocument();
  });

  it('opens preview dialog when clicking on file', () => {
    render(
      <FilePreview
        file={mockFile}
        onDelete={mockOnDelete}
      />
    );

    const fileContainer = screen.getByText('test.pdf').parentElement!;
    fireEvent.click(fileContainer);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders correct preview content based on file type', () => {
    const imageFile = {
      ...mockFile,
      type: 'image/jpeg',
    };

    const { rerender } = render(
      <FilePreview
        file={imageFile}
        onDelete={mockOnDelete}
      />
    );

    const fileContainer = screen.getByText('test.pdf').parentElement!;
    fireEvent.click(fileContainer);

    expect(screen.getByRole('img')).toBeInTheDocument();

    const pdfFile = {
      ...mockFile,
      type: 'application/pdf',
    };

    rerender(
      <FilePreview
        file={pdfFile}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByRole('iframe')).toBeInTheDocument();

    const otherFile = {
      ...mockFile,
      type: 'application/octet-stream',
    };

    rerender(
      <FilePreview
        file={otherFile}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('该文件类型暂不支持预览')).toBeInTheDocument();
  });

  it('calls onDelete when clicking delete button', () => {
    render(
      <FilePreview
        file={mockFile}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByRole('button');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockFile.id);
  });

  it('provides download option for unsupported file types', () => {
    const otherFile = {
      ...mockFile,
      type: 'application/octet-stream',
    };

    render(
      <FilePreview
        file={otherFile}
        onDelete={mockOnDelete}
      />
    );

    const fileContainer = screen.getByText('test.pdf').parentElement!;
    fireEvent.click(fileContainer);

    const downloadButton = screen.getByText('下载查看');
    expect(downloadButton).toBeInTheDocument();
  });
}); 