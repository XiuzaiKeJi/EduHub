import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Modal } from '../Modal';

describe('Modal', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with title and content', async () => {
    await act(async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="测试标题">
          <div>测试内容</div>
        </Modal>
      );
    });

    expect(screen.getByText('测试标题')).toBeInTheDocument();
    expect(screen.getByText('测试内容')).toBeInTheDocument();
    expect(screen.getByText('取消')).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', async () => {
    await act(async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>测试内容</div>
        </Modal>
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByText('取消'));
    });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when confirm button is clicked', async () => {
    await act(async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} onConfirm={mockOnConfirm}>
          <div>测试内容</div>
        </Modal>
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByText('确认'));
    });
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when loading', async () => {
    await act(async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} onConfirm={mockOnConfirm} loading={true}>
          <div>测试内容</div>
        </Modal>
      );
    });

    const cancelButton = screen.getByText('取消').closest('button');
    const confirmButton = screen.getByText('确认').closest('button');
    expect(cancelButton).toBeDisabled();
    expect(confirmButton).toBeDisabled();
  });

  it('uses custom button text', async () => {
    await act(async () => {
      render(
        <Modal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          confirmText="确定"
          cancelText="关闭"
        >
          <div>测试内容</div>
        </Modal>
      );
    });

    expect(screen.getByText('确定')).toBeInTheDocument();
    expect(screen.getByText('关闭')).toBeInTheDocument();
  });

  it('does not render confirm button when onConfirm is not provided', async () => {
    await act(async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>测试内容</div>
        </Modal>
      );
    });

    expect(screen.queryByText('确认')).not.toBeInTheDocument();
  });
}); 