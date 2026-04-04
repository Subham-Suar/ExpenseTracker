export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function formatDate(value) {
  if (!value) {
    return "--";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function toDateInputValue(value) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().split("T")[0];
}
