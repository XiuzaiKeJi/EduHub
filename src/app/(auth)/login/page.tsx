'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/form/Form';
import { Input } from '@/components/form/Input';
import { Button } from '@/components/form/Button';
import { Card } from '@/components/display/Card';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await signIn('credentials', {
        ...data,
        redirect: false,
      });

      if (result?.ok) {
        router.push('/dashboard');
      } else {
        setError(result?.error || '邮箱地址或密码错误');
      }
    } catch (e) {
      setError('登录失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            登录到您的账户
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            或者{' '}
            <a
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              注册新账户
            </a>
          </p>
        </div>

        <Form form={form} onSubmit={onSubmit} className="mt-8 space-y-6">
          {({ isSubmitting }) => (
            <>
              <div className="rounded-md shadow-sm space-y-4">
                <div>
                  <Input
                    {...form.register('email', { required: '邮箱地址是必填项' })}
                    type="email"
                    placeholder="邮箱地址"
                    error={form.formState.errors.email?.message}
                  />
                  {form.formState.errors.email && (
                    <div className="mt-1 text-sm text-red-500" data-testid="email-error">
                      {form.formState.errors.email.message}
                    </div>
                  )}
                </div>
                <div>
                  <Input
                    {...form.register('password', { required: '密码是必填项' })}
                    type="password"
                    placeholder="密码"
                    error={form.formState.errors.password?.message}
                  />
                  {form.formState.errors.password && (
                    <div className="mt-1 text-sm text-red-500" data-testid="password-error">
                      {form.formState.errors.password.message}
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <div>
                <Button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full"
                  data-testid="submit-button"
                >
                  {isSubmitting || isLoading ? '登录中...' : '登录'}
                </Button>
              </div>
            </>
          )}
        </Form>
      </Card>
    </div>
  );
} 