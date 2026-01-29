// Convert English numbers to Persian
export const toPersianNumber = (num: number | string): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
};

// Format balance as Toman with Persian numbers
export const formatBalance = (balance: number): string => {
  return new Intl.NumberFormat('fa-IR').format(balance);
};

