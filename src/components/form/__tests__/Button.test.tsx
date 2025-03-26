import { render, screen } from '@testing-library/react'
import { Button } from '../Button'
import '@testing-library/jest-dom'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>点击</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('点击')
  })

  it('renders icon', () => {
    render(<Button icon={<span data-testid="test-icon" />}>点击</Button>)
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })

  it('renders with primary variant', () => {
    render(<Button variant="primary">点击</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-indigo-600', 'text-white', 'hover:bg-indigo-700')
  })

  it('renders with secondary variant', () => {
    render(<Button variant="secondary">点击</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-white', 'text-gray-700', 'hover:bg-gray-50', 'border', 'border-gray-300')
  })

  it('renders with outline variant', () => {
    render(<Button variant="outline">点击</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-transparent', 'text-indigo-600', 'hover:bg-indigo-50', 'border', 'border-indigo-600')
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="small">小按钮</Button>)
    expect(screen.getByRole('button')).toHaveClass('px-3', 'py-1.5', 'text-sm')

    rerender(<Button size="medium">中按钮</Button>)
    expect(screen.getByRole('button')).toHaveClass('px-4', 'py-2')

    rerender(<Button size="large">大按钮</Button>)
    expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-lg')
  })

  it('is disabled when loading', () => {
    render(<Button isLoading>点击</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
  })

  it('shows loading spinner when loading', () => {
    render(<Button isLoading>点击</Button>)
    expect(screen.getByRole('button')).toContainElement(
      screen.getByTestId('loading-spinner')
    )
  })

  it('applies custom class name', () => {
    render(<Button className="test-class">点击</Button>)
    expect(screen.getByRole('button')).toHaveClass('test-class')
  })
}) 