export interface PasswordStrength {
  score: number; // 0-4, 0最弱，4最强
  isValid: boolean;
  feedback: string[];
}

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