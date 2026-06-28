export const cn = (...classes) => classes.filter(Boolean).join(' ');

export const formatDate = (date) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date));

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const truncate = (str, n) => (str.length > n ? str.slice(0, n) + '...' : str);