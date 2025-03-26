import { render, screen, fireEvent } from '@testing-library/react'
import Modal from '../Modal'

describe('Modal', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
  })

  it('renders modal content when open', () => {
    render(
      <Modal isOpen onClose={mockOnClose}>
        模态框内容
      </Modal>
    )
    expect(screen.getByText('模态框内容')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose}>
        模态框内容
      </Modal>
    )
    expect(screen.queryByText('模态框内容')).not.toBeInTheDocument()
  })

  it('renders with title and footer', () => {
    render(
      <Modal
        isOpen
        onClose={mockOnClose}
        title="模态框标题"
        footer={<button>确定</button>}
      >
        模态框内容
      </Modal>
    )
    expect(screen.getByText('模态框标题')).toBeInTheDocument()
    expect(screen.getByText('确定')).toBeInTheDocument()
  })

  it('calls onClose when clicking backdrop', () => {
    render(
      <Modal isOpen onClose={mockOnClose}>
        模态框内容
      </Modal>
    )
    fireEvent.click(screen.getByRole('dialog'))
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('calls onClose when clicking close button', () => {
    render(
      <Modal isOpen onClose={mockOnClose}>
        模态框内容
      </Modal>
    )
    fireEvent.click(screen.getByRole('button', { name: /关闭/i }))
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(
      <Modal isOpen onClose={mockOnClose} className="custom-class">
        模态框内容
      </Modal>
    )
    const modal = screen.getByRole('dialog')
    expect(modal).toHaveClass('custom-class')
  })
}) 