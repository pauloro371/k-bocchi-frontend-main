export const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});
export const distanceFormatter = new Intl.NumberFormat("es-MX", {
  style: "unit",
  unit: "kilometer",
});
export const numberFormatter = new Intl.NumberFormat("es-MX", {
  style: "decimal",
  maximumFractionDigits: 0,
});
