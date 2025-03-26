import { validatePassword } from '../utils';

describe('validatePassword', () => {
  it('returns valid feedback for strong password', () => {
    const result = validatePassword('Test123!@#');
    expect(result.isValid).toBe(true);
    expect(result.feedback).toEqual(['密码强度良好']);
  });

  it('requires uppercase letter', () => {
    const result = validatePassword('test123!@#');
    expect(result.isValid).toBe(false);
    expect(result.feedback).toContain('需要包含大写字母');
  });

  it('requires lowercase letter', () => {
    const result = validatePassword('TEST123!@#');
    expect(result.isValid).toBe(false);
    expect(result.feedback).toContain('需要包含小写字母');
  });

  it('requires number', () => {
    const result = validatePassword('TestTest!@#');
    expect(result.isValid).toBe(false);
    expect(result.feedback).toContain('需要包含数字');
  });

  it('requires special character', () => {
    const result = validatePassword('TestTest123');
    expect(result.isValid).toBe(false);
    expect(result.feedback).toContain('需要包含特殊字符');
  });

  it('requires minimum length', () => {
    const result = validatePassword('Test1!');
    expect(result.isValid).toBe(false);
    expect(result.feedback).toContain('密码长度至少为8个字符');
  });
}); 