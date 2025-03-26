import { render, screen } from '@testing-library/react'
import Layout from '../Layout'

describe('Layout', () => {
  it('renders layout with header, sidebar and main content', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    )

    // 检查是否渲染了所有主要组件
    expect(screen.getByText('EduHub')).toBeInTheDocument() // Header中的logo
    expect(screen.getByText('仪表盘')).toBeInTheDocument() // Sidebar中的导航项
    expect(screen.getByText('Test Content')).toBeInTheDocument() // Main content
  })

  it('renders children in main content area', () => {
    const testContent = 'Custom Content'
    render(<Layout>{testContent}</Layout>)
    expect(screen.getByText(testContent)).toBeInTheDocument()
  })

  it('applies correct layout structure', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    )

    // 检查布局结构
    expect(screen.getByRole('banner')).toBeInTheDocument() // Header
    expect(screen.getByRole('navigation')).toBeInTheDocument() // Sidebar
    expect(screen.getByRole('main')).toBeInTheDocument() // Main content
  })
}) 