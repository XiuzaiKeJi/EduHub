import { validatePassword } from '../(auth)/login/utils';

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