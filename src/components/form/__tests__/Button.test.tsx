import { render, screen, fireEvent } from '@testing-library/react'
import Button from '../Button'

describe('Button', () => {
  it('renders button with children', () => {
    render(<Button>点击我</Button>)
    expect(screen.getByText('点击我')).toBeInTheDocument()
  })

  it('applies primary variant styles by default', () => {
    render(<Button>按钮</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-indigo-600')
  })

  it('applies secondary variant styles when specified', () => {
    render(<Button variant="secondary">按钮</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-white')
  })

  it('applies danger variant styles when specified', () => {
    render(<Button variant="danger">按钮</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-red-600')
  })

  it('applies size styles correctly', () => {
    const { rerender } = render(<Button size="small">按钮</Button>)
    expect(screen.getByRole('button')).toHaveClass('px-2.5')

    rerender(<Button size="medium">按钮</Button>)
    expect(screen.getByRole('button')).toHaveClass('px-4')

    rerender(<Button size="large">按钮</Button>)
    expect(screen.getByRole('button')).toHaveClass('px-6')
  })

  it('shows loading spinner when isLoading is true', () => {
    render(<Button isLoading>加载中</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
    expect(document.querySelector('svg')).toBeInTheDocument()
  })

  it('renders icon when provided', () => {
    const TestIcon = () => <span data-testid="test-icon">图标</span>
    render(<Button icon={<TestIcon />}>按钮</Button>)
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })

  it('applies disabled styles when disabled', () => {
    render(<Button disabled>禁用按钮</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('opacity-50')
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>点击按钮</Button>)
    
    fireEvent.click(screen.getByText('点击按钮'))
    expect(handleClick).toHaveBeenCalled()
  })

  it('does not trigger click when disabled', () => {
    const handleClick = jest.fn()
    render(<Button disabled onClick={handleClick}>禁用按钮</Button>)
    
    fireEvent.click(screen.getByText('禁用按钮'))
    expect(handleClick).not.toHaveBeenCalled()
  })
}) 