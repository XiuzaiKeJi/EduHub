'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import ReCAPTCHA from 'react-google-recaptcha';
import { Form } from '@/components/form/Form';
import { Input } from '@/components/form/Input';
import { Button } from '@/components/form/Button';
import { Card } from '@/components/display/Card';
import { validatePassword, checkLoginAttempt, updateLoginAttempt, formatRemainingTime, verifyReCaptcha } from './utils';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const router = useRouter();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  
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

      // 检查登录尝试
      const attempt = checkLoginAttempt(data.email);
      if (attempt.isBlocked) {
        setError(`登录尝试次数过多，请在${formatRemainingTime(attempt.remainingTime)}后重试`);
        return;
      }

      // 验证reCAPTCHA
      if (!recaptchaToken) {
        setError('请完成人机验证');
        return;
      }

      const captchaResult = await verifyReCaptcha(recaptchaToken);
      if (!captchaResult.success) {
        setError(captchaResult.error);
        recaptchaRef.current?.reset();
        return;
      }

      // 验证密码强度
      const passwordStrength = validatePassword(data.password);
      if (!passwordStrength.isValid) {
        setError(passwordStrength.feedback.join('，'));
        return;
      }
      
      const result = await signIn('credentials', {
        ...data,
        redirect: false,
      });

      // 更新登录尝试记录
      updateLoginAttempt(data.email, result?.ok || false);

      if (result?.ok) {
        router.push('/dashboard');
      } else {
        setError(result?.error || '邮箱地址或密码错误');
        recaptchaRef.current?.reset();
      }
    } catch (e) {
      setError('登录失败，请稍后重试');
      recaptchaRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900" id="login-title">
            登录到您的账户
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            或者{' '}
            <a
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
              aria-label="注册新账户"
            >
              注册新账户
            </a>
          </p>
        </div>

        <Form 
          form={form} 
          onSubmit={onSubmit} 
          className="mt-8 space-y-6"
          role="form"
          aria-labelledby="login-title"
        >
          {({ isSubmitting }) => (
            <>
              <div className="rounded-md shadow-sm space-y-4">
                <div>
                  <Input
                    {...form.register('email', { required: '邮箱地址是必填项' })}
                    type="email"
                    placeholder="邮箱地址"
                    error={form.formState.errors.email?.message}
                    aria-required="true"
                    aria-invalid={!!form.formState.errors.email}
                    aria-describedby="email-error"
                  />
                  {form.formState.errors.email && (
                    <div 
                      className="mt-1 text-sm text-red-500" 
                      id="email-error"
                      role="alert"
                      data-testid="email-error"
                    >
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
                    aria-required="true"
                    aria-invalid={!!form.formState.errors.password}
                    aria-describedby="password-error"
                  />
                  {form.formState.errors.password && (
                    <div 
                      className="mt-1 text-sm text-red-500" 
                      id="password-error"
                      role="alert"
                      data-testid="password-error"
                    >
                      {form.formState.errors.password.message}
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div 
                  className="text-red-500 text-sm text-center"
                  role="alert"
                  aria-live="polite"
                >
                  {error}
                </div>
              )}

              <div 
                className="flex justify-center"
                aria-label="人机验证"
              >
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                  onChange={setRecaptchaToken}
                />
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full"
                  data-testid="submit-button"
                  aria-busy={isSubmitting || isLoading}
                  aria-disabled={isSubmitting || isLoading}
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