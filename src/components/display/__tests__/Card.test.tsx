import { render, screen } from '@testing-library/react'
import Card, { CardTitle, CardContent, CardCover, CardActions } from '../Card'

describe('Card', () => {
  it('renders with content', () => {
    render(<Card>卡片内容</Card>)
    expect(screen.getByText('卡片内容')).toBeInTheDocument()
  })

  it('renders with title', () => {
    render(
      <Card>
        <CardTitle>卡片标题</CardTitle>
        <CardContent>卡片内容</CardContent>
      </Card>
    )
    
    expect(screen.getByText('卡片标题')).toBeInTheDocument()
    expect(screen.getByText('卡片内容')).toBeInTheDocument()
  })

  it('renders with cover', () => {
    render(
      <Card>
        <CardCover>
          <img src="/test.jpg" alt="测试图片" />
        </CardCover>
        <CardContent>卡片内容</CardContent>
      </Card>
    )
    
    const img = screen.getByAltText('测试图片')
    expect(img).toBeInTheDocument()
    expect(img.closest('div')).toHaveClass('rounded-t-lg', 'overflow-hidden')
  })

  it('renders with actions', () => {
    render(
      <Card>
        <CardContent>卡片内容</CardContent>
        <CardActions>
          <button>确定</button>
          <button>取消</button>
        </CardActions>
      </Card>
    )
    
    expect(screen.getByText('确定')).toBeInTheDocument()
    expect(screen.getByText('取消')).toBeInTheDocument()
    expect(screen.getByText('确定').closest('div')).toHaveClass('border-t', 'border-gray-200')
  })

  it('shows loading state', () => {
    render(<Card isLoading>卡片内容</Card>)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders without border when bordered is false', () => {
    render(<Card bordered={false}>卡片内容</Card>)
    const card = screen.getByText('卡片内容').closest('div')
    expect(card).toHaveClass('border-0')
  })

  it('applies custom className', () => {
    render(<Card className="custom-class">卡片内容</Card>)
    const card = screen.getByText('卡片内容').closest('div')
    expect(card).toHaveClass('custom-class')
  })
}) 