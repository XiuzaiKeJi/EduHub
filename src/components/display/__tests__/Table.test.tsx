import { render, screen, fireEvent } from '@testing-library/react'
import Table from '../Table'

type TestData = {
  id: string
  name: string
  age: number
}

const mockData: TestData[] = [
  { id: '1', name: '张三', age: 25 },
  { id: '2', name: '李四', age: 30 }
]

const mockColumns = [
  { key: 'name', title: '姓名' },
  { key: 'age', title: '年龄' }
]

describe('Table', () => {
  it('renders table with data', () => {
    render(<Table columns={mockColumns} data={mockData} />)
    
    // 检查表头
    expect(screen.getByText('姓名')).toBeInTheDocument()
    expect(screen.getByText('年龄')).toBeInTheDocument()
    
    // 检查数据
    expect(screen.getByText('张三')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
    expect(screen.getByText('李四')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<Table columns={mockColumns} data={[]} loading />)
    expect(screen.getByText('加载中...')).toBeInTheDocument()
  })

  it('shows empty state', () => {
    render(<Table columns={mockColumns} data={[]} />)
    expect(screen.getByText('暂无数据')).toBeInTheDocument()
  })

  it('shows custom empty text', () => {
    render(<Table columns={mockColumns} data={[]} emptyText="没有找到数据" />)
    expect(screen.getByText('没有找到数据')).toBeInTheDocument()
  })

  it('renders custom cell content using render prop', () => {
    const columnsWithRender = [
      ...mockColumns,
      {
        key: 'action',
        title: '操作',
        render: (_: any, record: TestData) => (
          <button>编辑 {record.name}</button>
        )
      }
    ]

    render(<Table columns={columnsWithRender} data={mockData} />)
    expect(screen.getByText('编辑 张三')).toBeInTheDocument()
    expect(screen.getByText('编辑 李四')).toBeInTheDocument()
  })

  it('handles sort click', () => {
    const handleSort = jest.fn()
    const sortableColumns = [
      { key: 'name', title: '姓名', sortable: true },
      { key: 'age', title: '年龄' }
    ]

    render(
      <Table
        columns={sortableColumns}
        data={mockData}
        onSort={handleSort}
      />
    )

    const nameHeader = screen.getByText('姓名')
    fireEvent.click(nameHeader)
    expect(handleSort).toHaveBeenCalledWith('name', 'asc')
  })

  it('applies custom className', () => {
    render(
      <Table
        columns={mockColumns}
        data={mockData}
        className="custom-class"
      />
    )
    expect(screen.getByRole('table').parentElement).toHaveClass('custom-class')
  })
}) 