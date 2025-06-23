export function positiveIntegerSum(n) {
  // Convert to integer by flooring
  let integerN = Math.floor(n)
  
  if (integerN < 1) return false

  for (var total = 0; integerN > 0; integerN--) {
    total += integerN
  }

  return total
}
