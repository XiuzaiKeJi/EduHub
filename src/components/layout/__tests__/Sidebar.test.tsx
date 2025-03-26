import { render, screen, fireEvent } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Sidebar from '../Sidebar'

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('Sidebar', () => {
  beforeEach(() => {
    // 重置所有mock
    jest.clearAllMocks()
    // 设置默认路径
    ;(usePathname as jest.Mock).mockReturnValue('/dashboard')
  })

  it('renders sidebar with basic navigation items', () => {
    // 模拟未登录状态
    ;(useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    })

    render(<Sidebar />)

    // 检查基本导航项
    expect(screen.getByText('仪表盘')).toBeInTheDocument()
    expect(screen.getByText('课程')).toBeInTheDocument()
    expect(screen.getByText('任务')).toBeInTheDocument()
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

    render(<Sidebar />)

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

    render(<Sidebar />)

    expect(screen.getByText('管理')).toBeInTheDocument()
  })

  it('toggles sidebar collapse state when collapse button is clicked', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    })

    render(<Sidebar />)

    // 初始状态应该是展开的
    expect(screen.getByText('仪表盘')).toBeInTheDocument()
    expect(screen.getByText('课程')).toBeInTheDocument()
    expect(screen.getByText('任务')).toBeInTheDocument()

    // 点击折叠按钮
    const collapseButton = screen.getByRole('button')
    fireEvent.click(collapseButton)

    // 检查文本是否隐藏
    expect(screen.queryByText('仪表盘')).not.toBeInTheDocument()
    expect(screen.queryByText('课程')).not.toBeInTheDocument()
    expect(screen.queryByText('任务')).not.toBeInTheDocument()
  })

  it('highlights active navigation item', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    })

    // 设置当前路径为 /courses
    ;(usePathname as jest.Mock).mockReturnValue('/courses')

    render(<Sidebar />)

    // 检查课程链接是否有高亮样式
    const coursesLink = screen.getByText('课程').closest('a')
    expect(coursesLink).toHaveClass('bg-gray-100', 'text-gray-900')
  })
}) 