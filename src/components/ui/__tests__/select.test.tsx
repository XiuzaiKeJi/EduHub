import { render, screen, fireEvent } from '@testing-library/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';

describe('Select', () => {
  it('渲染Select组件', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="选择一个选项" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">选项1</SelectItem>
          <SelectItem value="2">选项2</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByText('选择一个选项')).toBeInTheDocument();
  });

  it('点击触发按钮时显示选项列表', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="选择一个选项" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">选项1</SelectItem>
          <SelectItem value="2">选项2</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByText('选择一个选项');
    fireEvent.click(trigger);

    expect(screen.getByText('选项1')).toBeInTheDocument();
    expect(screen.getByText('选项2')).toBeInTheDocument();
  });

  it('选择选项后更新显示的值', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="选择一个选项" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">选项1</SelectItem>
          <SelectItem value="2">选项2</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByText('选择一个选项');
    fireEvent.click(trigger);
    fireEvent.click(screen.getByText('选项1'));

    expect(screen.getByText('选项1')).toBeInTheDocument();
  });

  it('禁用状态下无法交互', () => {
    render(
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="选择一个选项" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">选项1</SelectItem>
          <SelectItem value="2">选项2</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByText('选择一个选项');
    fireEvent.click(trigger);

    expect(screen.queryByText('选项1')).not.toBeInTheDocument();
  });

  it('支持自定义样式', () => {
    render(
      <Select>
        <SelectTrigger className="custom-class">
          <SelectValue placeholder="选择一个选项" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">选项1</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByText('选择一个选项').parentElement;
    expect(trigger).toHaveClass('custom-class');
  });
}); 