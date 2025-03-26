import { render, screen, fireEvent } from '@testing-library/react'
import Sidebar from '../Sidebar'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
})

const defaultItems = [
  { href: '/dashboard', label: '仪表盘' },
  { href: '/courses', label: '课程' },
  { href: '/tasks', label: '任务' },
  { href: '/teams', label: '团队', role: 'TEACHER' },
  { href: '/admin', label: '管理', role: 'ADMIN' },
]

describe('Sidebar', () => {
  const mockUseSession = useSession as jest.Mock
  const mockUsePathname = usePathname as jest.Mock

  beforeEach(() => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          role: 'STUDENT',
        },
      },
    })
    mockUsePathname.mockReturnValue('/dashboard')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders navigation items', () => {
    const items = defaultItems.slice(0, 3)
    render(<Sidebar items={items} />)
    
    items.forEach(item => {
      const link = screen.getByRole('link', { name: item.label })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', item.href)
    })
  })

  it('filters navigation items based on user role', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          role: 'TEACHER',
        },
      },
    })

    render(<Sidebar items={defaultItems} />)
    
    expect(screen.getByText('仪表盘')).toBeInTheDocument()
    expect(screen.getByText('课程')).toBeInTheDocument()
    expect(screen.getByText('任务')).toBeInTheDocument()
    expect(screen.getByText('团队')).toBeInTheDocument()
    expect(screen.queryByText('管理')).not.toBeInTheDocument()
  })

  it('toggles collapse state when button is clicked', () => {
    const items = defaultItems.slice(0, 3)
    render(<Sidebar items={items} />)
    
    const toggleButton = screen.getByRole('button')
    fireEvent.click(toggleButton)
    
    expect(screen.queryByText('仪表盘')).not.toBeInTheDocument()
    expect(screen.queryByText('课程')).not.toBeInTheDocument()
    expect(screen.queryByText('任务')).not.toBeInTheDocument()
  })

  it('highlights active navigation item', () => {
    const items = defaultItems.slice(0, 3)
    render(<Sidebar items={items} />)
    
    const activeLink = screen.getByRole('link', { name: '仪表盘' })
    expect(activeLink).toHaveClass('bg-primary/10', 'text-primary')
    
    const inactiveLinks = items
      .filter(item => item.href !== '/dashboard')
      .map(item => screen.getByRole('link', { name: item.label }))
    
    inactiveLinks.forEach(link => {
      expect(link).not.toHaveClass('bg-primary/10', 'text-primary')
    })
  })

  it('applies custom class names', () => {
    const items = defaultItems.slice(0, 3)
    render(<Sidebar className="custom-class" items={items} />)
    
    const sidebar = screen.getByRole('navigation').parentElement
    expect(sidebar).toHaveClass('custom-class')
  })

  it('renders with custom menu items', () => {
    const customItems = [
      {
        href: '/custom',
        label: '自定义菜单',
        icon: '🔵',
      },
    ]
    render(<Sidebar items={customItems} />)
    
    const customLink = screen.getByRole('link', { name: /自定义菜单/ })
    expect(customLink).toBeInTheDocument()
    expect(customLink).toHaveAttribute('href', '/custom')
    expect(screen.getByText('🔵')).toBeInTheDocument()
    
    const standardItems = ['仪表盘', '课程', '任务']
    standardItems.forEach(label => {
      expect(screen.queryByText(label)).not.toBeInTheDocument()
    })
  })
}) 