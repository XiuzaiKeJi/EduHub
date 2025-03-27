import { render, screen } from '@testing-library/react';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders with default type', () => {
    render(<Badge>测试标签</Badge>);
    expect(screen.getByText('测试标签')).toBeInTheDocument();
  });

  it('renders with different types', () => {
    const { rerender } = render(<Badge type="success">成功</Badge>);
    expect(screen.getByText('成功')).toBeInTheDocument();

    rerender(<Badge type="warning">警告</Badge>);
    expect(screen.getByText('警告')).toBeInTheDocument();

    rerender(<Badge type="error">错误</Badge>);
    expect(screen.getByText('错误')).toBeInTheDocument();
  });
}); 