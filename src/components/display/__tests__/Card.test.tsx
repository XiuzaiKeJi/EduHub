import { render, screen } from '@testing-library/react'
import Card from '../Card'

describe('Card', () => {
  it('renders card with content', () => {
    render(<Card>卡片内容</Card>)
    expect(screen.getByText('卡片内容')).toBeInTheDocument()
  })

  it('renders card with title', () => {
    render(<Card title="卡片标题">卡片内容</Card>)
    expect(screen.getByText('卡片标题')).toBeInTheDocument()
  })

  it('renders card with cover', () => {
    const coverImage = <img src="test.jpg" alt="测试图片" />
    render(<Card cover={coverImage}>卡片内容</Card>)
    expect(screen.getByAltText('测试图片')).toBeInTheDocument()
  })

  it('renders card with actions', () => {
    const actions = (
      <>
        <button>编辑</button>
        <button>删除</button>
      </>
    )
    render(<Card actions={actions}>卡片内容</Card>)
    expect(screen.getByText('编辑')).toBeInTheDocument()
    expect(screen.getByText('删除')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<Card loading>卡片内容</Card>)
    expect(screen.getByText('加载中...')).toBeInTheDocument()
    expect(screen.queryByText('卡片内容')).not.toBeInTheDocument()
  })

  it('renders card without border when bordered is false', () => {
    const { container } = render(<Card bordered={false}>卡片内容</Card>)
    const card = container.firstChild as HTMLElement
    expect(card).not.toHaveClass('border')
  })

  it('renders card with border by default', () => {
    const { container } = render(<Card>卡片内容</Card>)
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('border')
  })

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">卡片内容</Card>)
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('custom-class')
  })
}) 