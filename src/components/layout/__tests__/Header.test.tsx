import { render, screen, fireEvent } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import Header from '../Header'
import { UserRole } from '@/types'

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}))

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('Header', () => {
  beforeEach(() => {
    // 重置所有mock
    jest.clearAllMocks()
  })

  it('renders header with navigation links', () => {
    // 模拟未登录状态
    ;(useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    })

    render(<Header />)

    // 检查基本导航链接
    expect(screen.getByText('首页')).toBeInTheDocument()
    expect(screen.getByText('仪表盘')).toBeInTheDocument()
    expect(screen.getByText('课程')).toBeInTheDocument()
    expect(screen.getByText('任务')).toBeInTheDocument()
    expect(screen.getByText('登录')).toBeInTheDocument()
  })

  it('shows user menu when logged in', () => {
    // 模拟已登录状态
    ;(useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Test User',
          role: 'STUDENT',
        },
      },
      status: 'authenticated',
    })

    render(<Header />)

    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('退出')).toBeInTheDocument()
  })

  it('shows teacher navigation items for teacher role', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Teacher User',
          role: 'TEACHER',
        },
      },
      status: 'authenticated',
    })

    render(<Header />)

    expect(screen.getByText('团队')).toBeInTheDocument()
  })

  it('shows admin navigation items for admin role', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Admin User',
          role: 'ADMIN',
        },
      },
      status: 'authenticated',
    })

    render(<Header />)

    expect(screen.getByText('管理')).toBeInTheDocument()
  })

  it('toggles mobile menu when menu button is clicked', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    })

    render(<Header />)

    // 点击菜单按钮
    const menuButton = screen.getByRole('button', { name: /打开主菜单/i })
    fireEvent.click(menuButton)

    // 检查移动端菜单是否显示
    expect(screen.getByText('首页')).toBeInTheDocument()
    expect(screen.getByText('仪表盘')).toBeInTheDocument()
    expect(screen.getByText('课程')).toBeInTheDocument()
    expect(screen.getByText('任务')).toBeInTheDocument()
    expect(screen.getByText('登录')).toBeInTheDocument()
  })
}) 