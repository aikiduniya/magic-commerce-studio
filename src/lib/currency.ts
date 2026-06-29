export function formatCurrency(amount: number, currency: string = "Rs."): string {
  const value = Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${currency} ${value}`;
}
