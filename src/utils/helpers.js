export const getRandom = arr =>
  arr[Math.round(Math.random() * (arr.length - 1))];

export const padEnd = (arr, len, fill) =>
  arr.concat(Array(len).fill(fill)).slice(0, len);
