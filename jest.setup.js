import '@testing-library/jest-dom'
import { loadEnvConfig } from '@next/env'

// 加载环境变量
loadEnvConfig(process.cwd())

// 模拟 Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    course: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    task: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
    comment: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
    attachment: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    }
  })),
  UserRole: {
    STUDENT: 'STUDENT',
    TEACHER: 'TEACHER',
    ADMIN: 'ADMIN',
  },
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }
  },
  usePathname() {
    return ''
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock fetch
global.fetch = jest.fn();

// 重置所有模拟
beforeEach(() => {
  jest.clearAllMocks();
});

// 设置超时时间
jest.setTimeout(10000);

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn()
}))

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
  auth: jest.fn()
}))

// Mock prisma
jest.mock('@/lib/db/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  }
}))

// Mock Request and Response
class MockRequest {
  #url
  #options

  constructor(url, options = {}) {
    this.#url = url
    this.#options = options
  }

  get url() {
    return this.#url
  }

  get method() {
    return this.#options.method || 'GET'
  }

  get headers() {
    return new Headers(this.#options.headers)
  }

  get body() {
    return this.#options.body
  }
}

global.Request = MockRequest

global.Response = class Response {
  constructor(body, init = {}) {
    this.body = body
    this.status = init.status || 200
    this.ok = init.status >= 200 && init.status < 300
    this.json = async () => JSON.parse(body)
  }
}

// Mock IntersectionObserver
class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = IntersectionObserver
global.ResizeObserver = ResizeObserver

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock components
jest.mock('@/components/display/Card', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="card">{children}</div>,
  Card: ({ children }) => <div data-testid="card">{children}</div>,
}))

jest.mock('@/components/form/Button', () => ({
  __esModule: true,
  Button: ({ children, onClick }) => (
    <button data-testid="button" onClick={onClick}>
      {children}
    </button>
  ),
}))

jest.mock('@/components/feedback/Modal', () => ({
  __esModule: true,
  Modal: ({ children, isOpen, onClose, title }) => (
    isOpen ? (
      <div data-testid="modal">
        <div data-testid="modal-title">{title}</div>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    ) : null
  ),
})) 