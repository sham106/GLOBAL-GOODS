// src/utils/generateRef.js

/**
 * Generates a unique tracking reference string like "GGS-2025-XXXX" where XXXX is a padded random 4-digit number.
 * @returns {string}
 */
export function generateRef() {
  const randomNumber = Math.floor(Math.random() * 10000); // 0 to 9999
  const paddedNumber = String(randomNumber).padStart(4, '0');
  return `RFQ-2025-${paddedNumber}`;
}

/**
 * Formats a number with comma separators (e.g. 20000 -> "20,000")
 * @param {number} value
 * @returns {string}
 */
export function formatNumber(value) {
  if (typeof value !== 'number') return value;
  return value.toLocaleString('en-US');
}

/**
 * Transforms an ISO string date into relative or styled text representation.
 * - If today: "Today, 9:14am"
 * - If yesterday: "Yesterday, 2:30pm"
 * - Otherwise: "Jun 12" or "May 28"
 * @param {string} isoString
 * @returns {string}
 */
export function formatDate(isoString) {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';

  // Get current date boundaries
  const now = new Date();
  
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // Format time: "9:14am" or "2:30pm" without internal spaces
  let timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  timeStr = timeStr.replace(/\s+/g, '').toLowerCase();

  if (compareDate.getTime() === today.getTime()) {
    return `Today, ${timeStr}`;
  } else if (compareDate.getTime() === yesterday.getTime()) {
    return `Yesterday, ${timeStr}`;
  } else {
    // Return: e.g., "Jun 12" or "May 28"
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
}
