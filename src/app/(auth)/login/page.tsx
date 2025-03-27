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
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
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

      // 验证 reCAPTCHA
      if (!recaptchaToken) {
        setError('请完成人机验证');
        return;
      }

      const isValidRecaptcha = await verifyReCaptcha(recaptchaToken);
      if (!isValidRecaptcha) {
        setError('人机验证失败，请重试');
        return;
      }

      // 尝试登录
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError('邮箱或密码错误');
        updateLoginAttempt(data.email);
        return;
      }

      // 登录成功，更新登录尝试记录
      updateLoginAttempt(data.email, true);
      router.push('/dashboard');
    } catch (err) {
      setError('登录失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            登录到您的账户
          </h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="邮箱地址"
            type="email"
            placeholder="请输入邮箱地址"
            {...register('email', {
              required: '请输入邮箱地址',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: '请输入有效的邮箱地址',
              },
            })}
            error={errors.email?.message}
          />
          <Input
            label="密码"
            type="password"
            placeholder="请输入密码"
            {...register('password', {
              required: '请输入密码',
              validate: validatePassword,
            })}
            error={errors.password?.message}
          />
          {error && (
            <div className="text-red-600 text-sm" data-testid="error-message">{error}</div>
          )}
          <div className="flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
              onChange={(token) => setRecaptchaToken(token)}
            />
          </div>
          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading}
            className="w-full"
            data-testid="submit-button"
          >
            登录
          </Button>
        </form>
      </Card>
    </div>
  );
} 