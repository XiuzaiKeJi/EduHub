import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import LoginPage from '../(auth)/login/page';
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

// Mock react-hook-form
jest.mock('react-hook-form', () => {
  const original = jest.requireActual('react-hook-form');
  return {
    ...original,
    useForm: () => ({
      ...original.useForm(),
      formState: {
        errors: {
          email: { message: '邮箱地址是必填项' },
          password: { message: '密码是必填项' },
        },
      },
    }),
  };
});

describe('LoginPage', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders login form', () => {
    render(<LoginPage />);
    
    expect(screen.getByText('登录到您的账户')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('邮箱地址')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('密码')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('shows validation errors for invalid input', async () => {
    render(<LoginPage />);
    
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('email-error')).toHaveTextContent('邮箱地址是必填项');
      expect(screen.getByTestId('password-error')).toHaveTextContent('密码是必填项');
    });
  });

  it('handles successful login', async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ ok: true, error: null });
    
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('邮箱地址');
    const passwordInput = screen.getByPlaceholderText('密码');
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false,
      });
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows error message on login failure', async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ ok: false, error: '邮箱地址或密码错误' });
    
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('邮箱地址');
    const passwordInput = screen.getByPlaceholderText('密码');
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('邮箱地址或密码错误')).toBeInTheDocument();
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  it('shows error message on network error', async () => {
    (signIn as jest.Mock).mockRejectedValueOnce(new Error('网络错误'));
    
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('邮箱地址');
    const passwordInput = screen.getByPlaceholderText('密码');
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('登录失败，请稍后重试')).toBeInTheDocument();
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  it('disables submit button while loading', async () => {
    (signIn as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<LoginPage />);
    
    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).not.toBeDisabled();

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('登录中...');
    });
  });
}); 