import { render, screen, fireEvent } from '@testing-library/react'
import Select from '../Select'

const mockOptions = [
  { value: '1', label: '选项1' },
  { value: '2', label: '选项2' },
  { value: '3', label: '选项3', disabled: true }
]

describe('Select', () => {
  it('renders select with options', () => {
    render(<Select options={mockOptions} />)
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(3)
    expect(options[0]).toHaveTextContent('选项1')
  })

  it('renders select with label', () => {
    render(<Select label="测试选择器" options={mockOptions} />)
    expect(screen.getByText('测试选择器')).toBeInTheDocument()
  })

  it('shows required asterisk when required is true', () => {
    render(<Select label="测试选择器" required options={mockOptions} />)
    const label = screen.getByText('测试选择器')
    expect(label.parentElement).toHaveTextContent('*')
  })

  it('shows placeholder when provided', () => {
    render(<Select placeholder="请选择" options={mockOptions} />)
    const placeholder = screen.getByRole('option', { name: '请选择' })
    expect(placeholder).toBeInTheDocument()
    expect(placeholder).toBeDisabled()
  })

  it('shows error message when error prop is provided', () => {
    const errorMessage = '请选择一个选项'
    render(<Select error={errorMessage} options={mockOptions} />)
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('applies disabled styles when disabled', () => {
    render(<Select disabled options={mockOptions} />)
    const select = screen.getByRole('combobox')
    expect(select).toBeDisabled()
    expect(select).toHaveClass('disabled:bg-gray-100')
  })

  it('handles value change', () => {
    const handleChange = jest.fn()
    render(<Select onChange={handleChange} options={mockOptions} />)
    const select = screen.getByRole('combobox')
    
    fireEvent.change(select, { target: { value: '2' } })
    expect(handleChange).toHaveBeenCalled()
  })

  it('disables specific options when specified', () => {
    render(<Select options={mockOptions} />)
    const disabledOption = screen.getByRole('option', { name: '选项3' })
    expect(disabledOption).toBeDisabled()
  })

  it('applies custom className', () => {
    render(<Select className="custom-class" options={mockOptions} />)
    expect(screen.getByRole('combobox')).toHaveClass('custom-class')
  })
}) 