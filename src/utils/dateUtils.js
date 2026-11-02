/**
 * Utility functions for date formatting and quiz topics
 */

/**
 * Returns formatted current date string e.g. "2 Nov 2026"
 * Space-delimited so .split(' ').slice(0, 2).join(' ') yields "2 Nov"
 */
export const getFormattedCurrentDate = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

/**
 * Returns today's quiz topic string
 */
export const getTodayQuizTopic = (date = new Date()) => {
  const formatted = getFormattedCurrentDate(date);
  return `Today in History & Current Affairs (${formatted})`;
};

