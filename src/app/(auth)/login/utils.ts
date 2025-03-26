export interface PasswordStrength {
  score: number; // 0-4, 0最弱，4最强
  isValid: boolean;
  feedback: string[];
}

export interface LoginAttempt {
  count: number;
  lastAttempt: number;
  isBlocked: boolean;
  remainingTime: number;
}

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15分钟，单位：毫秒

export function validatePassword(password: string): PasswordStrength {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const feedback: string[] = [];
  let score = 0;

  // 长度检查
  if (password.length < minLength) {
    feedback.push('密码长度至少为8个字符');
  }

  // 字符类型检查
  if (!hasUpperCase) {
    feedback.push('需要包含大写字母');
  }

  if (!hasLowerCase) {
    feedback.push('需要包含小写字母');
  }

  if (!hasNumbers) {
    feedback.push('需要包含数字');
  }

  if (!hasSpecialChar) {
    feedback.push('需要包含特殊字符');
  }

  // 计算分数
  if (password.length >= minLength) score++;
  if (hasUpperCase && hasLowerCase) score++;
  if (hasNumbers) score++;
  if (hasSpecialChar) score++;

  return {
    score,
    isValid: feedback.length === 0,
    feedback: feedback.length > 0 ? feedback : ['密码强度良好'],
  };
}

export function checkLoginAttempt(email: string): LoginAttempt {
  const key = `loginAttempt_${email}`;
  const now = Date.now();
  
  // 从localStorage获取登录尝试记录
  const storedAttempt = localStorage.getItem(key);
  const attempt = storedAttempt ? JSON.parse(storedAttempt) : { count: 0, lastAttempt: 0 };
  
  // 检查是否需要重置尝试次数（超过阻止时间）
  if (now - attempt.lastAttempt > BLOCK_DURATION) {
    attempt.count = 0;
  }
  
  const isBlocked = attempt.count >= MAX_ATTEMPTS && (now - attempt.lastAttempt) < BLOCK_DURATION;
  const remainingTime = isBlocked ? BLOCK_DURATION - (now - attempt.lastAttempt) : 0;
  
  return {
    count: attempt.count,
    lastAttempt: attempt.lastAttempt,
    isBlocked,
    remainingTime,
  };
}

export function updateLoginAttempt(email: string, success: boolean): LoginAttempt {
  const key = `loginAttempt_${email}`;
  const now = Date.now();
  
  // 从localStorage获取登录尝试记录
  const storedAttempt = localStorage.getItem(key);
  const attempt = storedAttempt ? JSON.parse(storedAttempt) : { count: 0, lastAttempt: 0 };
  
  // 如果登录成功，重置尝试次数
  if (success) {
    attempt.count = 0;
  } else {
    // 如果超过阻止时间，重置尝试次数
    if (now - attempt.lastAttempt > BLOCK_DURATION) {
      attempt.count = 1;
    } else {
      attempt.count += 1;
    }
  }
  
  attempt.lastAttempt = now;
  
  // 保存到localStorage
  localStorage.setItem(key, JSON.stringify(attempt));
  
  const isBlocked = attempt.count >= MAX_ATTEMPTS && (now - attempt.lastAttempt) < BLOCK_DURATION;
  const remainingTime = isBlocked ? BLOCK_DURATION - (now - attempt.lastAttempt) : 0;
  
  return {
    count: attempt.count,
    lastAttempt: attempt.lastAttempt,
    isBlocked,
    remainingTime,
  };
}

export function formatRemainingTime(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}分${seconds}秒`;
} 