import { render, screen } from '@testing-library/react'
import List from '../List'

const mockItems = [
  { id: '1', content: '项目1' },
  { id: '2', content: '项目2', actions: <button>操作</button> }
]

describe('List', () => {
  it('renders list with items', () => {
    render(<List items={mockItems} />)
    expect(screen.getByText('项目1')).toBeInTheDocument()
    expect(screen.getByText('项目2')).toBeInTheDocument()
    expect(screen.getByText('操作')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<List items={[]} loading />)
    expect(screen.getByText('加载中...')).toBeInTheDocument()
  })

  it('shows empty state', () => {
    render(<List items={[]} />)
    expect(screen.getByText('暂无数据')).toBeInTheDocument()
  })

  it('shows custom empty text', () => {
    render(<List items={[]} emptyText="列表为空" />)
    expect(screen.getByText('列表为空')).toBeInTheDocument()
  })

  it('renders list without dividers when divided is false', () => {
    render(<List items={mockItems} divided={false} />)
    const list = screen.getByRole('list')
    expect(list).not.toHaveClass('divide-y')
  })

  it('renders list with dividers by default', () => {
    render(<List items={mockItems} />)
    const list = screen.getByRole('list')
    expect(list).toHaveClass('divide-y')
  })

  it('applies custom className', () => {
    render(<List items={mockItems} className="custom-class" />)
    expect(screen.getByRole('list').parentElement).toHaveClass('custom-class')
  })

  it('renders items with actions', () => {
    const items = [
      {
        id: '1',
        content: '测试项目',
        actions: (
          <>
            <button>编辑</button>
            <button>删除</button>
          </>
        )
      }
    ]

    render(<List items={items} />)
    expect(screen.getByText('测试项目')).toBeInTheDocument()
    expect(screen.getByText('编辑')).toBeInTheDocument()
    expect(screen.getByText('删除')).toBeInTheDocument()
  })
}) 