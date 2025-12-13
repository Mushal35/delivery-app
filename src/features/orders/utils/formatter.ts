export const formatCurrency = (amount: string | number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
};

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
};