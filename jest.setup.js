import '@testing-library/jest-dom'
import { loadEnvConfig } from '@next/env'

// 加载环境变量
loadEnvConfig(process.cwd())

// 模拟 Headers 对象
global.Headers = class Headers {
  #headers = new Map()

  constructor(init = {}) {
    if (init instanceof Headers) {
      init.forEach((value, key) => this.#headers.set(key.toLowerCase(), value))
    } else if (typeof init === 'object') {
      Object.entries(init).forEach(([key, value]) => {
        this.#headers.set(key.toLowerCase(), value)
      })
    }
  }

  append(name, value) {
    const key = name.toLowerCase()
    const current = this.#headers.get(key)
    this.#headers.set(key, current ? `${current}, ${value}` : value)
  }

  delete(name) {
    this.#headers.delete(name.toLowerCase())
  }

  get(name) {
    return this.#headers.get(name.toLowerCase()) || null
  }

  has(name) {
    return this.#headers.has(name.toLowerCase())
  }

  set(name, value) {
    this.#headers.set(name.toLowerCase(), value)
  }

  forEach(callback) {
    this.#headers.forEach((value, key) => callback(value, key, this))
  }

  entries() {
    return this.#headers.entries()
  }

  keys() {
    return this.#headers.keys()
  }

  values() {
    return this.#headers.values()
  }
}

// 模拟 Request 和 Response 对象
global.Request = class Request {
  #url;
  #options;
  #headers;
  #cookies;

  constructor(url, options = {}) {
    this.#url = url instanceof URL ? url : new URL(url);
    this.#options = options;
    this.#headers = new Headers(options.headers);
    this.#cookies = new Map();
  }

  get url() {
    return this.#url.toString();
  }

  get headers() {
    return this.#headers;
  }

  get cookies() {
    return {
      get: (key) => this.#cookies.get(key),
      getAll: () => Object.fromEntries(this.#cookies),
      set: (key, value) => this.#cookies.set(key, value),
      delete: (key) => this.#cookies.delete(key),
    };
  }
}

global.Response = class Response {
  constructor(body, init) {
    this.body = body
    this.status = init?.status || 200
    this.statusText = init?.statusText || ''
    this.headers = new Headers(init?.headers)
  }
}

// 模拟 Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  })),
  UserRole: {
    STUDENT: 'STUDENT',
    TEACHER: 'TEACHER',
    ADMIN: 'ADMIN',
  },
}))

// Mock fetch
global.fetch = jest.fn((url, options) => {
  const { method, headers, body } = options || {}
  
  if (url === '/api/auth/register' && method === 'POST') {
    const data = JSON.parse(body)
    
    // 模拟邮箱已存在的情况
    if (data.email === 'existing@example.com') {
      return Promise.resolve({
        status: 400,
        json: () => Promise.resolve({ error: '该邮箱已被注册' })
      })
    }
    
    // 模拟输入验证失败的情况
    if (data.email === 'invalid-email' || data.password.length < 6 || data.name.length < 2) {
      return Promise.resolve({
        status: 400,
        json: () => Promise.resolve({ error: '输入数据验证失败' })
      })
    }
    
    // 模拟成功注册
    return Promise.resolve({
      status: 200,
      json: () => Promise.resolve({
        id: '1',
        ...data,
        password: undefined
      })
    })
  }
  
  return Promise.reject(new Error(`Unhandled request: ${url}`))
})

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
});

// Mock IntersectionObserver
class IntersectionObserver {
  constructor() {
    this.observe = jest.fn();
    this.unobserve = jest.fn();
    this.disconnect = jest.fn();
  }
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })),
}); 