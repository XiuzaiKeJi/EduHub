import { render, screen, fireEvent } from '@testing-library/react'
import Input from '../Input'

describe('Input', () => {
  it('renders input with label', () => {
    render(<Input label="用户名" />)
    expect(screen.getByText('用户名')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('shows required asterisk when required is true', () => {
    render(<Input label="用户名" required />)
    const label = screen.getByText('用户名')
    expect(label.parentElement).toHaveTextContent('*')
  })

  it('shows error message when error prop is provided', () => {
    const errorMessage = '请输入用户名'
    render(<Input error={errorMessage} />)
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('applies disabled styles when disabled', () => {
    render(<Input disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:bg-gray-100')
  })

  it('handles value change', () => {
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} />)
    const input = screen.getByRole('textbox')
    
    fireEvent.change(input, { target: { value: 'test' } })
    expect(handleChange).toHaveBeenCalled()
  })

  it('renders password input when type is password', () => {
    const { container } = render(<Input type="password" />)
    const input = container.querySelector('input[type="password"]')
    expect(input).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Input className="custom-class" />)
    expect(screen.getByRole('textbox')).toHaveClass('custom-class')
  })
}) 