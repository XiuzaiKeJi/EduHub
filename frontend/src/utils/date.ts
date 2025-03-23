/**
 * 格式化日期
 * @param date 日期对象或日期字符串
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * 判断日期是否已过期
 * @param date 日期对象或日期字符串
 * @returns 是否已过期
 */
export const isOverdue = (date: Date | string | undefined): boolean => {
  if (!date) return false;
  const d = new Date(date);
  return d.getTime() < Date.now();
};

/**
 * 获取相对时间描述
 * @param date 日期对象或日期字符串
 * @returns 相对时间描述
 */
export const getRelativeTime = (date: Date | string | undefined): string => {
  if (!date) return '';
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  
  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;

  if (diff < minute) {
    return '刚刚';
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`;
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`;
  } else if (diff < week) {
    return `${Math.floor(diff / day)}天前`;
  } else if (diff < month) {
    return `${Math.floor(diff / week)}周前`;
  } else if (diff < year) {
    return `${Math.floor(diff / month)}个月前`;
  } else {
    return `${Math.floor(diff / year)}年前`;
  }
}; 