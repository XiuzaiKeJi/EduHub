import { useEffect, useState } from 'react';

/**
 * 防抖钩子函数，延迟指定时间后返回最新的值
 * @param value 需要防抖的值
 * @param delay 延迟时间，单位毫秒，默认500ms
 * @returns 防抖后的值
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 在下一次effect触发前清理
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
} 