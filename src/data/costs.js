export function formatUSD(n) {
  return `$${(n || 0).toFixed(2)}`
}
