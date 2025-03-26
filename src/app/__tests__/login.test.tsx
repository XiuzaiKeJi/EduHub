import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import LoginPage from '../(auth)/login/page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}))

// Mock ReCAPTCHA
jest.mock('react-google-recaptcha', () => {
  const mockReact = require('react')
  const ReCAPTCHA = jest.fn(({ onChange }) => {
    // 自动触发 onChange，模拟用户完成验证
    mockReact.useEffect(() => {
      onChange('test-token')
    }, [])
    return null
  })
  return {
    __esModule: true,
    default: ReCAPTCHA,
  }
})

// Mock login utils
jest.mock('../(auth)/login/utils', () => ({
  validatePassword: jest.fn().mockReturnValue({ isValid: true, feedback: [] }),
  checkLoginAttempt: jest.fn().mockReturnValue({ isBlocked: false }),
  updateLoginAttempt: jest.fn(),
  formatRemainingTime: jest.fn(),
  verifyReCaptcha: jest.fn().mockResolvedValue({ success: true }),
}))

// Mock Form component
jest.mock('@/components/form/Form', () => {
  const mockReact = require('react')
  return {
    Form: mockReact.forwardRef(({ children, onSubmit, form }, ref) => {
      const [isSubmitting, setIsSubmitting] = mockReact.useState(false)

      const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const email = formData.get('email')
        const password = formData.get('password')
        
        const newErrors = {}
        if (!email) {
          form.setError('email', { message: '邮箱地址是必填项' })
        }
        if (!password) {
          form.setError('password', { message: '密码是必填项' })
        }
        
        if (!email || !password) {
          return
        }

        try {
          setIsSubmitting(true)
          await onSubmit({
            email,
            password,
          })
        } finally {
          setIsSubmitting(false)
        }
      }
      
      return (
        <form onSubmit={handleSubmit} ref={ref}>
          {children && typeof children === 'function' && children({ 
            isSubmitting,
            register: (name) => ({
              name,
              id: name,
              ref: null,
              onChange: () => {},
              onBlur: () => {},
            }),
          })}
        </form>
      )
    })
  }
})

// Mock useForm hook
jest.mock('react-hook-form', () => ({
  useForm: () => {
    const mockReact = require('react')
    const [errors, setErrors] = mockReact.useState({})
    
    return {
      register: (name, options) => ({
        name,
        id: name,
        ref: null,
        onChange: () => {},
        onBlur: () => {},
      }),
      formState: {
        errors,
      },
      setError: (field, { message }) => {
        setErrors(prev => ({
          ...prev,
          [field]: { message },
        }))
      },
      trigger: () => Promise.resolve(true),
    }
  },
}))

// Mock Button component
jest.mock('@/components/form/Button', () => {
  const mockReact = require('react')
  return {
    Button: mockReact.forwardRef(({ children, isLoading, disabled, ...props }, ref) => (
      <button
        {...props}
        ref={ref}
        disabled={isLoading || disabled}
        aria-busy={isLoading}
        aria-disabled={isLoading || disabled}
        data-testid={props['data-testid'] || 'submit-button'}
      >
        {isLoading ? '加载中...' : children}
      </button>
    ))
  }
})

// Mock Input component
jest.mock('@/components/form/Input', () => {
  const mockReact = require('react')
  return {
    Input: mockReact.forwardRef(({ error, id, name, ...props }, ref) => (
      <div>
        <input
          {...props}
          ref={ref}
          name={name}
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-required={props.required}
        />
        {error && (
          <div
            className="mt-1 text-sm text-red-500"
            id={`${id}-error`}
            data-testid={`${id}-error`}
            role="alert"
          >
            {error}
          </div>
        )}
      </div>
    ))
  }
})

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders login form', () => {
    render(<LoginPage />)
    expect(screen.getByPlaceholderText('邮箱地址')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('密码')).toBeInTheDocument()
    expect(screen.getByTestId('submit-button')).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    render(<LoginPage />)
    const submitButton = screen.getByTestId('submit-button')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByTestId('email-error')).toHaveTextContent('邮箱地址是必填项')
      expect(screen.getByTestId('password-error')).toHaveTextContent('密码是必填项')
    })
    expect(signIn).not.toHaveBeenCalled()
  })

  it('handles successful login', async () => {
    const mockRouter = { push: jest.fn() }
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(signIn as jest.Mock).mockResolvedValueOnce({ ok: true })

    render(<LoginPage />)

    const emailInput = screen.getByPlaceholderText('邮箱地址')
    const passwordInput = screen.getByPlaceholderText('密码')
    const submitButton = screen.getByTestId('submit-button')

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false,
      })
    })

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('shows error message on login failure', async () => {
    ;(signIn as jest.Mock).mockResolvedValueOnce({ ok: false, error: '邮箱或密码错误' })

    render(<LoginPage />)

    const emailInput = screen.getByPlaceholderText('邮箱地址')
    const passwordInput = screen.getByPlaceholderText('密码')
    const submitButton = screen.getByTestId('submit-button')

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false,
      })
    })

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('邮箱或密码错误')
    })
  })

  it('shows network error message', async () => {
    ;(signIn as jest.Mock).mockRejectedValueOnce(new Error('网络错误，请稍后重试'))

    render(<LoginPage />)

    const emailInput = screen.getByPlaceholderText('邮箱地址')
    const passwordInput = screen.getByPlaceholderText('密码')
    const submitButton = screen.getByTestId('submit-button')

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false,
      })
    })

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('网络错误，请稍后重试')
    })
  })
})