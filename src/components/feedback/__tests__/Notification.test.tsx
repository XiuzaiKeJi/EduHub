import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Notification } from '../Notification';
import '@testing-library/jest-dom';

describe('Notification', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders notification with title and content', () => {
    render(<Notification title="测试标题" content="测试内容" />);
    expect(screen.getByText('测试标题')).toBeInTheDocument();
    expect(screen.getByText('测试内容')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders notification with different types', () => {
    const { rerender } = render(
      <Notification type="success" title="成功通知" content="操作成功" />
    );
    expect(screen.getByText('成功通知')).toBeInTheDocument();

    rerender(<Notification type="error" title="错误通知" content="操作失败" />);
    expect(screen.getByText('错误通知')).toBeInTheDocument();

    rerender(<Notification type="warning" title="警告通知" content="警告信息" />);
    expect(screen.getByText('警告通知')).toBeInTheDocument();

    rerender(<Notification type="info" title="信息通知" content="普通信息" />);
    expect(screen.getByText('信息通知')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<Notification title="测试标题" content="测试内容" onClose={onClose} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('auto closes after duration', () => {
    const onClose = jest.fn();
    render(
      <Notification
        title="测试标题"
        content="测试内容"
        duration={3000}
        onClose={onClose}
      />
    );
    
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not auto close when duration is 0', () => {
    const onClose = jest.fn();
    render(
      <Notification
        title="测试标题"
        content="测试内容"
        duration={0}
        onClose={onClose}
      />
    );
    
    act(() => {
      jest.advanceTimersByTime(4500);
    });
    
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByText('测试标题')).toBeInTheDocument();
  });

  it('renders with custom icon', () => {
    const customIcon = <div data-testid="custom-icon">自定义图标</div>;
    render(
      <Notification
        title="测试标题"
        content="测试内容"
        icon={customIcon}
      />
    );
    
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Notification
        title="测试标题"
        content="测试内容"
        className="custom-class"
      />
    );
    
    const notificationElement = container.firstChild;
    expect(notificationElement).toHaveClass('custom-class');
  });

  it('renders with different placements', () => {
    const { rerender, container } = render(
      <Notification
        title="测试标题"
        content="测试内容"
        placement="topRight"
      />
    );
    
    expect(container.firstChild).toHaveClass('top-4', 'right-4');

    rerender(
      <Notification
        title="测试标题"
        content="测试内容"
        placement="bottomLeft"
      />
    );
    
    expect(container.firstChild).toHaveClass('bottom-4', 'left-4');
  });
}); 