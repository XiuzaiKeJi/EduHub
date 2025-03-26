import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '../Input'

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="用户名" />)
    expect(screen.getByLabelText('用户名')).toBeInTheDocument()
  })

  it('shows required asterisk when required is true', () => {
    render(<Input label="用户名" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('shows error message when error prop is provided', () => {
    render(<Input label="用户名" error="用户名不能为空" />)
    expect(screen.getByText('用户名不能为空')).toBeInTheDocument()
  })

  it('applies disabled styles when disabled is true', () => {
    render(<Input label="用户名" disabled />)
    const input = screen.getByLabelText('用户名')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:bg-gray-50', 'disabled:cursor-not-allowed', 'disabled:opacity-50')
  })

  it('handles value changes', () => {
    const handleChange = jest.fn()
    render(<Input label="用户名" onChange={handleChange} />)
    const input = screen.getByLabelText('用户名')
    fireEvent.change(input, { target: { value: 'test' } })
    expect(handleChange).toHaveBeenCalled()
  })

  it('renders as password input when type is password', () => {
    render(<Input label="密码" type="password" />)
    const input = screen.getByLabelText('密码')
    expect(input).toHaveAttribute('type', 'password')
  })

  it('applies custom className', () => {
    render(<Input label="用户名" className="custom-class" />)
    const input = screen.getByLabelText('用户名')
    expect(input).toHaveClass('custom-class')
  })

  it('renders with placeholder', () => {
    render(<Input label="用户名" placeholder="请输入用户名" />)
    const input = screen.getByLabelText('用户名')
    expect(input).toHaveAttribute('placeholder', '请输入用户名')
  })

  it('applies error styles when error is present', () => {
    render(<Input label="用户名" error="用户名不能为空" />)
    const input = screen.getByLabelText('用户名')
    expect(input).toHaveClass('border-red-500')
  })

  it('generates unique id when not provided', () => {
    render(<Input label="User Name" />)
    const input = screen.getByLabelText('User Name')
    expect(input).toHaveAttribute('id', 'user-name')
  })
}) 