import { validatePassword, checkLoginAttempt, updateLoginAttempt, formatRemainingTime } from '../(auth)/login/utils';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key],
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('validatePassword', () => {
  it('should return invalid for short password', () => {
    const result = validatePassword('abc');
    expect(result.isValid).toBe(false);
    expect(result.score).toBe(0);
    expect(result.feedback).toContain('密码长度至少为8个字符');
  });

  it('should return invalid for password without uppercase', () => {
    const result = validatePassword('abcd1234!');
    expect(result.isValid).toBe(false);
    expect(result.score).toBe(3);
    expect(result.feedback).toContain('需要包含大写字母');
  });

  it('should return invalid for password without lowercase', () => {
    const result = validatePassword('ABCD1234!');
    expect(result.isValid).toBe(false);
    expect(result.score).toBe(3);
    expect(result.feedback).toContain('需要包含小写字母');
  });

  it('should return invalid for password without numbers', () => {
    const result = validatePassword('abcdABCD!');
    expect(result.isValid).toBe(false);
    expect(result.score).toBe(3);
    expect(result.feedback).toContain('需要包含数字');
  });

  it('should return invalid for password without special characters', () => {
    const result = validatePassword('abcdABCD1234');
    expect(result.isValid).toBe(false);
    expect(result.score).toBe(3);
    expect(result.feedback).toContain('需要包含特殊字符');
  });

  it('should return valid for strong password', () => {
    const result = validatePassword('abcdABCD1234!');
    expect(result.isValid).toBe(true);
    expect(result.score).toBe(4);
    expect(result.feedback).toEqual(['密码强度良好']);
  });
});

describe('Login Attempt Management', () => {
  const testEmail = 'test@example.com';
  const now = Date.now();

  beforeEach(() => {
    localStorageMock.clear();
    jest.spyOn(Date, 'now').mockImplementation(() => now);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('checkLoginAttempt', () => {
    it('should return initial state for new email', () => {
      const result = checkLoginAttempt(testEmail);
      expect(result).toEqual({
        count: 0,
        lastAttempt: 0,
        isBlocked: false,
        remainingTime: 0,
      });
    });

    it('should return blocked state after max attempts', () => {
      // 模拟5次失败尝试
      for (let i = 0; i < 5; i++) {
        updateLoginAttempt(testEmail, false);
      }

      const result = checkLoginAttempt(testEmail);
      expect(result.isBlocked).toBe(true);
      expect(result.count).toBe(5);
    });

    it('should reset count after block duration', () => {
      // 模拟5次失败尝试
      for (let i = 0; i < 5; i++) {
        updateLoginAttempt(testEmail, false);
      }

      // 模拟时间经过16分钟
      jest.spyOn(Date, 'now').mockImplementation(() => now + 16 * 60 * 1000);

      const result = checkLoginAttempt(testEmail);
      expect(result.isBlocked).toBe(false);
      expect(result.count).toBe(0);
    });
  });

  describe('updateLoginAttempt', () => {
    it('should increment count on failed attempt', () => {
      const result = updateLoginAttempt(testEmail, false);
      expect(result.count).toBe(1);
    });

    it('should reset count on successful attempt', () => {
      // 先失败两次
      updateLoginAttempt(testEmail, false);
      updateLoginAttempt(testEmail, false);

      // 然后成功一次
      const result = updateLoginAttempt(testEmail, true);
      expect(result.count).toBe(0);
    });

    it('should block after max attempts', () => {
      // 模拟5次失败尝试
      for (let i = 0; i < 5; i++) {
        updateLoginAttempt(testEmail, false);
      }

      const result = updateLoginAttempt(testEmail, false);
      expect(result.isBlocked).toBe(true);
      expect(result.remainingTime).toBe(15 * 60 * 1000); // 15分钟
    });
  });

  describe('formatRemainingTime', () => {
    it('should format time correctly', () => {
      expect(formatRemainingTime(90000)).toBe('1分30秒');
      expect(formatRemainingTime(45000)).toBe('0分45秒');
      expect(formatRemainingTime(900000)).toBe('15分0秒');
    });
  });
}); 