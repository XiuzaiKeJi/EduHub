import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Message } from '../Message';
import '@testing-library/jest-dom';

describe('Message', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders message with default type', () => {
    render(<Message content="测试消息" />);
    expect(screen.getByText('测试消息')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders message with different types', () => {
    const { rerender } = render(<Message type="success" content="成功消息" />);
    expect(screen.getByText('成功消息')).toBeInTheDocument();

    rerender(<Message type="error" content="错误消息" />);
    expect(screen.getByText('错误消息')).toBeInTheDocument();

    rerender(<Message type="warning" content="警告消息" />);
    expect(screen.getByText('警告消息')).toBeInTheDocument();

    rerender(<Message type="info" content="信息消息" />);
    expect(screen.getByText('信息消息')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<Message content="测试消息" onClose={onClose} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('auto closes after duration', () => {
    const onClose = jest.fn();
    render(<Message content="测试消息" duration={3000} onClose={onClose} />);
    
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not auto close when duration is 0', () => {
    const onClose = jest.fn();
    render(<Message content="测试消息" duration={0} onClose={onClose} />);
    
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByText('测试消息')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Message content="测试消息" className="custom-class" />);
    const messageElement = container.firstChild;
    expect(messageElement).toHaveClass('custom-class');
  });
}); 