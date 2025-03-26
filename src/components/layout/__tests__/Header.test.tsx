import { render, screen, fireEvent } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import Header from '../Header'

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

    // 检查桌面端导航链接
    const desktopNav = screen.getByRole('navigation')
    expect(desktopNav).toHaveTextContent('首页')
    expect(desktopNav).toHaveTextContent('仪表盘')
    expect(desktopNav).toHaveTextContent('课程')
    expect(desktopNav).toHaveTextContent('任务')
    
    // 使用getAllByRole来处理多个登录链接
    const loginLinks = screen.getAllByRole('link', { name: '登录' })
    expect(loginLinks.length).toBeGreaterThan(0)
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

    // 检查桌面端用户菜单
    const userMenu = screen.getAllByText('Test User')[0]
    expect(userMenu).toBeInTheDocument()
    expect(screen.getAllByText('退出')[0]).toBeInTheDocument()
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

    // 检查桌面端导航
    const desktopNav = screen.getByRole('navigation')
    expect(desktopNav).toHaveTextContent('团队')
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

    // 检查桌面端导航
    const desktopNav = screen.getByRole('navigation')
    expect(desktopNav).toHaveTextContent('管理')
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
    const mobileMenu = screen.getByRole('navigation')
    expect(mobileMenu).toHaveTextContent('首页')
    expect(mobileMenu).toHaveTextContent('仪表盘')
    expect(mobileMenu).toHaveTextContent('课程')
    expect(mobileMenu).toHaveTextContent('任务')
    expect(mobileMenu).toHaveTextContent('登录')
  })
}) 