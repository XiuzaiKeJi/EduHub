import { render, screen } from '@testing-library/react'
import Layout from '../Layout'
import { SessionProvider } from 'next-auth/react'

// 模拟 next-auth 的 useSession hook
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: null,
    status: 'unauthenticated'
  }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}))

describe('Layout', () => {
  it('renders layout with header, sidebar and main content', () => {
    render(
      <SessionProvider>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </SessionProvider>
    )
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getAllByRole('navigation')).toHaveLength(2) // 顶部导航和侧边栏导航
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('renders children in main content area', () => {
    render(
      <SessionProvider>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </SessionProvider>
    )
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies correct layout structure', () => {
    const { container } = render(
      <SessionProvider>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </SessionProvider>
    )
    expect(container.firstChild).toHaveClass('min-h-screen')
    expect(screen.getByRole('main')).toHaveClass('flex-1')
  })
}) 